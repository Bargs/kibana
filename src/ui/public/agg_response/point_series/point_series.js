import _ from 'lodash';
import AggResponsePointSeriesGetSeriesProvider from '../../agg_response/point_series/_get_series';
import AggResponsePointSeriesGetAspectsProvider from '../../agg_response/point_series/_get_aspects';
import AggResponsePointSeriesInitYAxisProvider from '../../agg_response/point_series/_init_y_axis';
import AggResponsePointSeriesInitXAxisProvider from '../../agg_response/point_series/_init_x_axis';
import AggResponsePointSeriesOrderedDateAxisProvider from '../../agg_response/point_series/_ordered_date_axis';
import AggResponsePointSeriesTooltipFormatterProvider from '../../agg_response/point_series/_tooltip_formatter';
export default function PointSeriesProvider(Private) {

  let getSeries = Private(AggResponsePointSeriesGetSeriesProvider);
  let getAspects = Private(AggResponsePointSeriesGetAspectsProvider);
  let initYAxis = Private(AggResponsePointSeriesInitYAxisProvider);
  let initXAxis = Private(AggResponsePointSeriesInitXAxisProvider);
  let setupOrderedDateXAxis = Private(AggResponsePointSeriesOrderedDateAxisProvider);
  let tooltipFormatter = Private(AggResponsePointSeriesTooltipFormatterProvider);

  return function pointSeriesChartDataFromTable(vis, table) {
    let chart = {};
    let aspects = chart.aspects = getAspects(vis, table);

    chart.tooltipFormatter = tooltipFormatter;

    initXAxis(chart);
    initYAxis(chart);

    let datedX = aspects.x.agg.type.ordered && aspects.x.agg.type.ordered.date;
    if (datedX) {
      setupOrderedDateXAxis(vis, chart);
    }

    chart.series = getSeries(table.rows, chart);

    delete chart.aspects;
    return chart;
  };
};
