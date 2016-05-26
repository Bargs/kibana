import AggResponseHierarchicalBuildHierarchicalDataProvider from '../agg_response/hierarchical/build_hierarchical_data';
import AggResponsePointSeriesPointSeriesProvider from '../agg_response/point_series/point_series';
import AggResponseTabifyTabifyProvider from '../agg_response/tabify/tabify';
import AggResponseGeoJsonGeoJsonProvider from '../agg_response/geo_json/geo_json';

export default function NormalizeChartDataFactory(Private) {
  return {
    hierarchical: Private(AggResponseHierarchicalBuildHierarchicalDataProvider),
    pointSeries: Private(AggResponsePointSeriesPointSeriesProvider),
    tabify: Private(AggResponseTabifyTabifyProvider),
    geoJson: Private(AggResponseGeoJsonGeoJsonProvider)
  };
};
