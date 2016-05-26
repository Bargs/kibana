import IndexedArray from '../indexed_array';
import '../agg_types/agg_params';
import AggTypesMetricsCountProvider from '../agg_types/metrics/count';
import AggTypesMetricsAvgProvider from '../agg_types/metrics/avg';
import AggTypesMetricsSumProvider from '../agg_types/metrics/sum';
import AggTypesMetricsMedianProvider from '../agg_types/metrics/median';
import AggTypesMetricsMinProvider from '../agg_types/metrics/min';
import AggTypesMetricsMaxProvider from '../agg_types/metrics/max';
import AggTypesMetricsStdDeviationProvider from '../agg_types/metrics/std_deviation';
import AggTypesMetricsCardinalityProvider from '../agg_types/metrics/cardinality';
import AggTypesMetricsPercentilesProvider from '../agg_types/metrics/percentiles';
import AggTypesMetricsPercentileRanksProvider from '../agg_types/metrics/percentile_ranks';
import AggTypesBucketsDateHistogramProvider from '../agg_types/buckets/date_histogram';
import AggTypesBucketsHistogramProvider from '../agg_types/buckets/histogram';
import AggTypesBucketsRangeProvider from '../agg_types/buckets/range';
import AggTypesBucketsDateRangeProvider from '../agg_types/buckets/date_range';
import AggTypesBucketsIpRangeProvider from '../agg_types/buckets/ip_range';
import AggTypesBucketsTermsProvider from '../agg_types/buckets/terms';
import AggTypesBucketsFiltersProvider from '../agg_types/buckets/filters';
import AggTypesBucketsSignificantTermsProvider from '../agg_types/buckets/significant_terms';
import AggTypesBucketsGeoHashProvider from '../agg_types/buckets/geo_hash';
export default function AggTypeService(Private) {

  let aggs = {
    metrics: [
      Private(AggTypesMetricsCountProvider),
      Private(AggTypesMetricsAvgProvider),
      Private(AggTypesMetricsSumProvider),
      Private(AggTypesMetricsMedianProvider),
      Private(AggTypesMetricsMinProvider),
      Private(AggTypesMetricsMaxProvider),
      Private(AggTypesMetricsStdDeviationProvider),
      Private(AggTypesMetricsCardinalityProvider),
      Private(AggTypesMetricsPercentilesProvider),
      Private(AggTypesMetricsPercentileRanksProvider)
    ],
    buckets: [
      Private(AggTypesBucketsDateHistogramProvider),
      Private(AggTypesBucketsHistogramProvider),
      Private(AggTypesBucketsRangeProvider),
      Private(AggTypesBucketsDateRangeProvider),
      Private(AggTypesBucketsIpRangeProvider),
      Private(AggTypesBucketsTermsProvider),
      Private(AggTypesBucketsFiltersProvider),
      Private(AggTypesBucketsSignificantTermsProvider),
      Private(AggTypesBucketsGeoHashProvider)
    ]
  };

  Object.keys(aggs).forEach(function (type) {
    aggs[type].forEach(function (agg) {
      agg.type = type;
    });
  });


  /**
   * IndexedArray of Aggregation Types.
   *
   * These types form two groups, metric and buckets.
   *
   * @module agg_types
   * @type {IndexedArray}
   */
  return new IndexedArray({

    /**
     * @type {Array}
     */
    index: ['name'],

    /**
     * [group description]
     * @type {Array}
     */
    group: ['type'],
    initialSet: aggs.metrics.concat(aggs.buckets)
  });
};

// preload
