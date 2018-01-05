import _ from 'lodash';
import './table_header.less';
import 'ui/filters/short_dots';
import headerHtml from 'ui/doc_table/components/table_header.html';
import { uiModules } from 'ui/modules';
const module = uiModules.get('app/discover');


module.directive('kbnTableHeader', function (shortDotsFilter) {
  return {
    restrict: 'A',
    scope: {
      columns: '=',
      sortOrder: '=',
      indexPattern: '=',
      onChangeSortOrder: '=?',
      onRemoveColumn: '=?',
      onMoveColumn: '=?',
    },
    template: headerHtml,
    controller: function ($scope) {
      $scope.isSortableColumn = function isSortableColumn(columnName) {
        return (
          !!$scope.indexPattern
          && _.isFunction($scope.onChangeSortOrder)
          && _.get($scope, ['indexPattern', 'fields', 'byName', columnName, 'sortable'], false)
        );
      };

      $scope.tooltip = function (column) {
        if (!$scope.isSortableColumn(column)) return '';
        return 'Sort by ' + shortDotsFilter(column);
      };

      $scope.canMoveColumnLeft = function canMoveColumn(columnName) {
        return (
          _.isFunction($scope.onMoveColumn)
          && $scope.columns.indexOf(columnName) > 0
        );
      };

      $scope.canMoveColumnRight = function canMoveColumn(columnName) {
        return (
          _.isFunction($scope.onMoveColumn)
          && $scope.columns.indexOf(columnName) < $scope.columns.length - 1
        );
      };

      $scope.canRemoveColumn = function canRemoveColumn(columnName) {
        return (
          _.isFunction($scope.onRemoveColumn)
          && (columnName !== '_source' || $scope.columns.length > 1)
        );
      };

      $scope.headerClass = function (column) {
        if (!$scope.isSortableColumn(column)) return;

        const sortOrder = $scope.sortOrder;
        const defaultClass = ['fa', 'fa-sort', 'table-header-sortchange'];

        if (!sortOrder || column !== sortOrder[0]) return defaultClass;
        return ['fa', sortOrder[1] === 'asc' ? 'fa-sort-up' : 'fa-sort-down'];
      };

      $scope.moveColumnLeft = function moveLeft(columnName) {
        const newIndex = $scope.columns.indexOf(columnName) - 1;

        if (newIndex < 0) {
          return;
        }

        $scope.onMoveColumn(columnName, newIndex);
      };

      $scope.moveColumnRight = function moveRight(columnName) {
        const newIndex = $scope.columns.indexOf(columnName) + 1;

        if (newIndex >= $scope.columns.length) {
          return;
        }

        $scope.onMoveColumn(columnName, newIndex);
      };

      $scope.cycleSortOrder = function cycleSortOrder(columnName) {
        if (!$scope.isSortableColumn(columnName)) {
          return;
        }

        /*
        Cycle goes Unsorted -> Asc -> Desc -> Unsorted

        $scope.sortOrder is array of arrays
        1. Loop through each pair
        2. If any pair matches given columnName
          2a. If Asc, flip to Desc
          2b. If Desc, remove from array
            2b2. If array is empty, add default sort (I think we can just pass empty array?)
        3. If there's no match, add Asc sort to the end of array
        */

        // const [currentColumnName, currentDirection = 'asc'] = $scope.sortOrder;
        // const newDirection = (
        //   (columnName === currentColumnName && currentDirection === 'asc')
        //     ? 'desc'
        //     : 'asc'
        // );

        const sortPair = $scope.sortOrder.find((pair) => pair[0] === columnName);
        if (sortPair === undefined) {
          $scope.sortOrder.push([columnName, 'asc']);
        }
        else {
          const currentSortDirection = sortPair[1];
          if (currentSortDirection === 'asc') {
            sortPair[1] = 'desc';
          }
          else {
            _.remove($scope.sortOrder, (pair) => pair[0] === columnName);
          }
        }

        $scope.onChangeSortOrder(_.cloneDeep($scope.sortOrder));
      };

      $scope.getAriaLabelForColumn = function getAriaLabelForColumn(name) {
        if (!$scope.isSortableColumn(name)) return null;

        const [currentColumnName, currentDirection = 'asc'] = $scope.sortOrder;
        if(name === currentColumnName && currentDirection === 'asc') {
          return `Sort ${name} descending`;
        }

        return `Sort ${name} ascending`;
      };
    }
  };
});
