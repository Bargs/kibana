import _ from 'lodash';
import listTemplate from '../typeahead/partials/typeahead-items.html';
import '../notify/directives';
import uiModules from '../modules';
let typeahead = uiModules.get('kibana/typeahead');


typeahead.directive('kbnTypeaheadItems', function () {
  return {
    restrict: 'E',
    require: '^kbnTypeahead',
    replace: true,
    template: listTemplate,

    link: function ($scope, $el, attr, typeaheadCtrl) {
      $scope.typeahead = typeaheadCtrl;
    }
  };
});
