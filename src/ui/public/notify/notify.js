import _ from 'lodash';
import $ from 'jquery';
import modules from '../modules';
import errors from '../notify/errors';
import Notifier from '../notify/notifier';
import '../notify/directives';
import chrome from '../chrome';
import { kbnIndex } from '../metadata';
let module = modules.get('kibana/notify');
let rootNotifier = new Notifier();

module.factory('createNotifier', function () {
  return function (opts) {
    return new Notifier(opts);
  };
});

module.factory('Notifier', function () {
  return Notifier;
});

// teach Notifier how to use angular interval services
module.run(function ($interval) {
  Notifier.applyConfig({
    setInterval: $interval,
    clearInterval: $interval.cancel
  });
});

// if kibana is not included then the notify service can't
// expect access to config (since it's dependent on kibana)
if (!!kbnIndex) {
  require('ui/config');
  module.run(function (config) {
    config.watchAll(() => {
      Notifier.applyConfig({
        errorLifetime: config.get('notifications:lifetime:error'),
        warningLifetime: config.get('notifications:lifetime:warning'),
        infoLifetime: config.get('notifications:lifetime:info')
      });
    });
  });
}

window.onerror = function (err, url, line) {
  rootNotifier.fatal(new Error(err + ' (' + url + ':' + line + ')'));
  return true;
};

if (window.addEventListener) {
  const notify = new Notifier({
    location: 'Promise'
  });

  window.addEventListener('unhandledrejection', function (e) {
    notify.log(`Detected an unhandled Promise rejection.\n${e.reason}`);
  });
}

export default rootNotifier;
