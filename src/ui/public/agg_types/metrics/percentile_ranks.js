import _ from 'lodash';
import valuesEditor from '../../agg_types/controls/percentile_ranks.html';
import '../../number_list';
import AggTypesMetricsMetricAggTypeProvider from '../../agg_types/metrics/metric_agg_type';
import AggTypesMetricsGetResponseAggConfigClassProvider from '../../agg_types/metrics/get_response_agg_config_class';
import RegistryFieldFormatsProvider from '../../registry/field_formats';
import getPercentileValue from './percentiles_get_value';

export default function AggTypeMetricPercentileRanksProvider(Private) {
  let MetricAggType = Private(AggTypesMetricsMetricAggTypeProvider);
  let getResponseAggConfigClass = Private(AggTypesMetricsGetResponseAggConfigClassProvider);
  let fieldFormats = Private(RegistryFieldFormatsProvider);

  // required by the values editor

  let valueProps = {
    makeLabel: function () {
      let field = this.field();
      let format = (field && field.format) || fieldFormats.getDefaultInstance('number');
      const label = this.params.customLabel || this.fieldDisplayName();

      return 'Percentile rank ' + format.convert(this.key, 'text') + ' of "' + label + '"';
    }
  };

  return new MetricAggType({
    name: 'percentile_ranks',
    title: 'Percentile Ranks',
    makeLabel: function (agg) {
      return 'Percentile ranks of ' + agg.fieldDisplayName();
    },
    params: [
      {
        name: 'field',
        filterFieldTypes: 'number'
      },
      {
        name: 'values',
        editor: valuesEditor,
        default: []
      },
      {
        write(agg, output) {
          output.params.keyed = false;
        }
      }
    ],
    getResponseAggs: function (agg) {
      let ValueAggConfig = getResponseAggConfigClass(agg, valueProps);

      return agg.params.values.map(function (value) {
        return new ValueAggConfig(value);
      });
    },
    getFormat: function () {
      return fieldFormats.getInstance('percent') || fieldFormats.getDefaultInstance('number');
    },
    getValue: function (agg, bucket) {
      return getPercentileValue(agg, bucket) / 100;
    }
  });
};
