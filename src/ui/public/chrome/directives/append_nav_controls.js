import $ from 'jquery';

import chromeNavControlsRegistry from '../../registry/chrome_nav_controls';
import UiModules from '../../modules';

export default function (chrome, internals) {

  UiModules
  .get('kibana')
  .directive('kbnChromeAppendNavControls', function (Private) {
    return {
      template: function ($element) {
        const parts = [$element.html()];
        const controls = Private(chromeNavControlsRegistry);

        for (const control of controls.inOrder) {
          parts.unshift(
            `<!-- nav control ${control.name} -->`,
            control.template
          );
        }

        return parts.join('\n');
      }
    };
  });

}
