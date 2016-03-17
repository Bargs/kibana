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

        $http.post(`../api/kibana/${this.results.indexPattern.id}/_bulk`, formData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        })
        .then(
          (res) => {
            this.progress = 'DONE!';
          },
          (err) => {
            notify.error(err);
            $window.scrollTo(0, 0);
          }
        );
      }
    };
  });
