import html from '../partials/info.html';
import uiModules from '../modules';

uiModules
  .get('kibana')
  .directive('kbnInfo', function () {
    return {
      restrict: 'E',
      scope: {
        info: '@',
        placement: '@'
      },
      template: html,
      link: function ($scope) {
        $scope.placement = $scope.placement || 'top';
      }
    };
  });
