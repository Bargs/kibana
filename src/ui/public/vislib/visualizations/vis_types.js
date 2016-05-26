import VislibVisualizationsColumnChartProvider from '../../vislib/visualizations/column_chart';
import VislibVisualizationsPieChartProvider from '../../vislib/visualizations/pie_chart';
import VislibVisualizationsLineChartProvider from '../../vislib/visualizations/line_chart';
import VislibVisualizationsAreaChartProvider from '../../vislib/visualizations/area_chart';
import VislibVisualizationsTileMapProvider from '../../vislib/visualizations/tile_map';

export default function VisTypeFactory(Private) {

  /**
   * Provides the visualizations for the vislib
   *
   * @module vislib
   * @submodule VisTypeFactory
   * @param Private {Object} Loads any function as an angular module
   * @return {Function} Returns an Object of Visualization classes
   */
  return {
    histogram: Private(VislibVisualizationsColumnChartProvider),
    pie: Private(VislibVisualizationsPieChartProvider),
    line: Private(VislibVisualizationsLineChartProvider),
    area: Private(VislibVisualizationsAreaChartProvider),
    tile_map: Private(VislibVisualizationsTileMapProvider)
  };
};
