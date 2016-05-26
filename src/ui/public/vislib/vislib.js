import '../vislib/lib/handler/types/pie';
import '../vislib/lib/handler/types/point_series';
import '../vislib/lib/handler/types/tile_map';
import '../vislib/lib/handler/handler_types';
import '../vislib/lib/layout/layout_types';
import '../vislib/lib/data';
import '../vislib/visualizations/_map.js';
import '../vislib/visualizations/vis_types';
import '../vislib/styles/main.less';
import VislibVisProvider from '../vislib/vis';
// prefetched for faster optimization runs
// end prefetching

/**
 * Provides the Kibana4 Visualization Library
 *
 * @module vislib
 * @main vislib
 * @return {Object} Contains the version number and the Vis Class for creating visualizations
 */
module.exports = function VislibProvider(Private) {

  return {
    version: '0.0.0',
    Vis: Private(VislibVisProvider)
  };
};
