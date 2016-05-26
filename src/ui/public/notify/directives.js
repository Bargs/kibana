import _ from 'lodash';
import uiModules from '../modules';
import toasterTemplate from '../notify/partials/toaster.html';
import '../notify/notify.less';

let notify = uiModules.get('kibana/notify');

notify.directive('kbnNotifications', function () {
  return {
    restrict: 'E',
    scope: {
      list: '=list'
    },
    replace: true,
    template: toasterTemplate
  };
});
