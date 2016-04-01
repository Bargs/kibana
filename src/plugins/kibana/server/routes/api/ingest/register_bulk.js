import { Promise } from 'bluebird';
import { parse, transform } from 'csv';
import _ from 'lodash';
import hi from 'highland';
import { patternToIngest } from '../../../../common/lib/convert_pattern_and_ingest_name';

export function registerBulk(server) {
  server.route({
    path: '/api/kibana/{id}/_bulk',
    method: 'POST',
    config: {
      payload: {
        output: 'stream',
        maxBytes: 1024 * 1024 * 1024
      }
    },
    handler: function (req, reply) {
      const boundCallWithRequest = _.partial(server.plugins.elasticsearch.callWithRequest, req);
      const indexPattern = req.params.id;
      const usePipeline = req.payload.pipeline;
      const csv = req.payload.csv;
      const fileName = csv.hapi.filename;
      const parser = parse({columns: true, auto_parse: true});
      const parseErrors = [];
      let currentLine = 2; // Starts at 2 since we parse the header separately

      csv.pipe(parser);

      hi(parser)
      .stopOnError((err) => {
        parseErrors.push(err.message)
      })
      .consume((err, doc, push, next) => {
        if (err) {
          push(err, null);
          next();
        }
        else if (doc === hi.nil) {
          // pass nil (end event) along the stream
          push(null, doc);
        }
        else {
          push(null, {index: {_id: `L${currentLine} - ${fileName}`}});
          push(null, doc);
          currentLine++;
          next();
        }
      })
      .batch(10000)
      .map((bulkBody) => {
        const bulkParams = {
          index: indexPattern,
          type: 'default',
          body: bulkBody
        };
        
        if (usePipeline) {
          bulkParams.pipeline = patternToIngest(indexPattern);
        }
        
        return hi(boundCallWithRequest('bulk', bulkParams));
      })
      .parallel(2)
      .flatMap(response => response.items)
      .map(docResponse => docResponse.index)
      .reduce({created: 0, errors: false}, (memo, docResponse) => {
        if (docResponse.error) {
          if (_.isUndefined(memo.indexErrors)) {
            memo.indexErrors = [];
          }
          memo.indexErrors.push(_.pick(docResponse, ['_id', 'error']));
          memo.errors = true;
        }
        else {
          memo.created++;
        }

        return memo;
      })
      .apply((results) => {
        if (!_.isEmpty(parseErrors)) {
          results.errors = true;
          results.parseErrors = parseErrors;
        }
        reply(results);
      });
    }
  });
}
