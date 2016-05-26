import modules from '../../modules';

modules.get('kibana').config(function ($provide) {
  $provide.decorator('timefilter', function ($delegate) {
    $delegate.init();
    return $delegate;
  });
});
