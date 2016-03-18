import _ from 'lodash';
import handleESError from '../../../lib/handle_es_error';

export default function registerBulk(server) {
  server.route({
    path: '/api/kibana/{id}/_bulk',
    method: ['POST'],
    handler: function (req, reply) {
      const boundCallWithRequest = _.partial(server.plugins.elasticsearch.callWithRequest, req);

      const body = _.reduce(req.payload, (bulkPayload, doc) => {
        bulkPayload.push({index: {}});
        bulkPayload.push(doc);
        return bulkPayload;
      }, []);

      boundCallWithRequest('bulk', {
        index: req.params.id,
        type: 'test',
        body: body
      })
      .then(
        function (res) {
          reply(res);
        },
        function (error) {
          reply(handleESError(error));
        }
      );
    }
  });
}
