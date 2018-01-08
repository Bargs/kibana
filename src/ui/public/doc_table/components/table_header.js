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

        const defaultClass = ['fa', 'fa-sort', 'table-header-sortchange'];
        const sortOrder = $scope.sortOrder || [];
        const columnSortOrder = sortOrder.find((sortPair) => column === sortPair[0]);

        if (!columnSortOrder) return defaultClass;
        return ['fa', columnSortOrder[1] === 'asc' ? 'fa-sort-up' : 'fa-sort-down'];
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

        const sortPair = $scope.sortOrder.find((pair) => pair[0] === columnName);

        // Cycle goes Unsorted -> Asc -> Desc -> Unsorted
        if (sortPair === undefined) {
          $scope.onChangeSortOrder([[columnName, 'asc'], ...$scope.sortOrder]);
        }
        else if (sortPair[1] === 'asc') {
          $scope.onChangeSortOrder([[columnName, 'desc'], ...$scope.sortOrder.filter((pair) => pair[0] !== columnName)]);
        }
        else if (sortPair[1] === 'desc' && $scope.sortOrder.length === 1) {
          // If we're at the end of the cycle and this is the only existing sort, we switch
          // back to ascending sort instead of removing it.
          $scope.onChangeSortOrder([[columnName, 'asc']]);
        }
        else {
          $scope.onChangeSortOrder($scope.sortOrder.filter((pair) => pair[0] !== columnName));
        }
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
