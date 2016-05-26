import toUser from '../parse_query/lib/to_user';
import ParseQueryLibFromUserProvider from '../parse_query/lib/from_user';
import uiModules from '../modules';
uiModules
  .get('kibana')
  .directive('parseQuery', function (Private) {
    let fromUser = Private(ParseQueryLibFromUserProvider);

    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        'ngModel': '='
      },
      link: function ($scope, elem, attr, ngModel) {
        let init = function () {
          $scope.ngModel = fromUser($scope.ngModel);
        };

        ngModel.$parsers.push(fromUser);
        ngModel.$formatters.push(toUser);

        init();
      }
    };
  });
