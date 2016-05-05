import PluginsKibanaSettingsSectionsIndicesRefreshKibanaIndexProvider from 'plugins/kibana/settings/sections/indices/_refresh_kibana_index';
import uiModules from 'ui/modules';
import kbnSettingsIndicesTemplate from './index_pattern_list.html';

uiModules.get('apps/settings')
.directive('indexPatternList', function ($route, config, kbnUrl, indexPatterns, Private) {
  return {
    restrict: 'E',
    template: kbnSettingsIndicesTemplate,
    controller: function ($scope) {
      const refreshKibanaIndex = Private(PluginsKibanaSettingsSectionsIndicesRefreshKibanaIndexProvider);

      $scope.makeUrl = function (id) {
        return kbnUrl.eval('#/settings/indices/edit/{{id}}', {id: id});
      };

      config.$bind($scope, 'defaultIndex');

      function refreshIndexPatternList() {
        indexPatterns.getIds.clearCache();
        indexPatterns.getIds()
        .then((ids) => {
          $scope.indexPatternIds = ids;
        });
      }

      $scope.$watch('defaultIndex', refreshIndexPatternList);

      $scope.$on('ingest:updated', () => {
        refreshKibanaIndex().then(refreshIndexPatternList);
      });

      $scope.$emit('application.load');
    }
  };
});
