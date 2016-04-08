import _ from 'lodash';
import $ from 'jquery';
import uiModules from 'ui/modules';
var module = uiModules.get('kibana');

var html = '<span class="dropzone" ng-transclude></span>';

module.directive('fileUpload', function () {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      onRead: '&',
      onLocate: '&',
      label: '='
    },
    template: html,
    link: function ($scope, $elem, attrs) {
      var $button = $elem.find('.upload');
      var $dropzone = $elem.find('.dropzone');

      const handleFile = (file) => {
        if (_.isUndefined(file)) return;

        if ($scope.onRead) {
          var reader = new FileReader();
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.onRead({fileContents: e.target.result});
            });
          };
          reader.readAsText(file);
        }

        if ($scope.onLocate) {
          $scope.onLocate({ file });
        }
      };

      $dropzone.on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      );

      $dropzone.on('dragenter', function (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      );

      $dropzone.on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const file = _.get(e, 'originalEvent.dataTransfer.files[0]');

        if (file) {
          handleFile(file);
        }
      });

      if ($button) {
        const $fileInput = $('<input type="file" style="opacity: 0; position:absolute; right: -999999999px" id="testfile" />');
        $elem.append($fileInput);

        $fileInput.on('change', function (e) {
          var target = e.srcElement || e.target;
          if (_.get(target, 'files.length')) {
            handleFile(target.files[0]);
          }
        });

        $button.on('click', function (e) {
          $fileInput.val(null);
          $fileInput.trigger('click');
        });
      }
    }
  };
});
