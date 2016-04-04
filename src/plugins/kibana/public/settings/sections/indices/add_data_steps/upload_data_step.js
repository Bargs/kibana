import modules from 'ui/modules';
import template from 'plugins/kibana/settings/sections/indices/add_data_steps/upload_data_step.html';
import _ from 'lodash';
import angular from 'angular';

modules.get('apps/settings')
  .directive('uploadDataStep', function () {
    return {
      template: template,
      scope: {
        results: '='
      },
      bindToController: true,
      controllerAs: 'uploadStep',
      controller: function ($scope, $http, Notifier, $window) {
        var notify = new Notifier({
          location: 'Add Data'
        });

        const formData = new FormData();
        formData.append('csv', this.results.file);
        formData.append('pipeline', true);

        $http.post(`../api/kibana/${this.results.indexPattern.id}/_bulk`, formData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        })
        .then(
          (res) => {
            this.created = 0;
            this.formattedErrors = [];
            _.forEach(res.data, (bulkResponse) => {
              this.created += bulkResponse.created;
              this.formattedErrors = this.formattedErrors.concat(_.map(bulkResponse.indexErrors, (doc) => {
                return `${doc._id.split('-', 1)[0].replace('L', 'Line ').trim()}: ${doc.error.type} - ${doc.error.reason}`;
              }));
              if (!_.isEmpty(bulkResponse.parseErrors)) {
                this.formattedErrors = this.formattedErrors.concat(bulkResponse.parseErrors);
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
