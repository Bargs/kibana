import VislibLibHandlerHandlerProvider from '../../../../vislib/lib/handler/handler';
import VislibLibDataProvider from '../../../../vislib/lib/data';
import VislibLibChartTitleProvider from '../../../../vislib/lib/chart_title';

export default function PieHandler(Private) {
  let Handler = Private(VislibLibHandlerHandlerProvider);
  let Data = Private(VislibLibDataProvider);
  let ChartTitle = Private(VislibLibChartTitleProvider);

  /*
   * Handler for Pie visualizations.
   */

  return function (vis) {
    return new Handler(vis, {
      chartTitle: new ChartTitle(vis.el)
    });
  };
};
