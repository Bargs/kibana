import _ from 'lodash';
import Papa from 'papaparse';
import modules from 'ui/modules';
import template from 'plugins/kibana/settings/sections/indices/add_data_steps/parse_csv_step.html';

modules.get('apps/settings')
  .directive('parseCsvStep', function () {
    return {
      restrict: 'E',
      template: template,
      scope: {
        file: '=',
        parseOptions: '=',
        samples: '='
      },
      bindToController: true,
      controllerAs: 'wizard',
      controller: function ($scope) {

        this.parse = () => {
          if (!this.file) return;

          const config = _.assign(
            {
              header: true,
              preview: 1,
              dynamicTyping: true,
              step: (results) => {
                $scope.$apply(() => {
                  this.columns = results.meta.fields;
                  this.rows = _.map(results.data, _.values);
                  this.samples = results.data;
                  this.parseOptions = _.defaults({}, this.parseOptions, {delimiter: results.meta.delimiter})
                });
              }
            },
            this.parseOptions
          );

          Papa.parse(this.file, config);
        };

        $scope.$watch('wizard.parseOptions', this.parse, true);
        $scope.$watch('wizard.file', this.parse);

        this.parse();
      }
    };
  });
