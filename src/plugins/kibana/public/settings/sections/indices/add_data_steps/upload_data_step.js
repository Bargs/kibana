import modules from 'ui/modules';
import template from 'plugins/kibana/settings/sections/indices/add_data_steps/upload_data_step.html';
import _ from 'lodash';
import IngestProvider from 'ui/ingest';

modules.get('apps/settings')
  .directive('uploadDataStep', function () {
    return {
      template: template,
      scope: {
        results: '='
      },
      bindToController: true,
      controllerAs: 'uploadStep',
      controller: function ($scope, $http, Notifier, $window, Private) {
        const ingest = Private(IngestProvider);
        const notify = new Notifier({
          location: 'Add Data'
        });

        ingest.bulk(this.results.file, this.results.indexPattern.id, this.results.parseOptions.delimiter, true)
        .then(
          (res) => {
            this.created = 0;
            this.formattedErrors = [];
            _.forEach(res.data, (bulkResponse) => {
              this.created += bulkResponse.created;
              this.formattedErrors = this.formattedErrors.concat(_.map(_.get(bulkResponse, 'errors.index'), (doc) => {
                return `${doc._id.split('-', 1)[0].replace('L', 'Line ').trim()}: ${doc.error.type} - ${doc.error.reason}`;
              }));
              if (!_.isEmpty(_.get(bulkResponse, 'errors.other'))) {
                this.formattedErrors = this.formattedErrors.concat(bulkResponse.errors.other);
              }
            });
          },
          (err) => {
            notify.error(err);
            $window.scrollTo(0, 0);
          }
        );
      }
    };
  });
