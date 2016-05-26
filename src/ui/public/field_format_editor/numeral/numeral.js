import '../../field_format_editor/pattern/pattern';
import uiModules from '../../modules';
import numeralTemplate from '../../field_format_editor/numeral/numeral.html';

uiModules
.get('kibana')
.directive('fieldEditorNumeral', function () {
  return {
    restrict: 'E',
    template: numeralTemplate
  };
});
