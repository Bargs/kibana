import _ from 'lodash';
import { FilterBarLibMapAndFlattenFiltersProvider } from 'ui/filter_bar/lib/map_and_flatten_filters';
import { FilterBarLibExtractTimeFilterProvider } from 'ui/filter_bar/lib/extract_time_filter';
import { FilterBarLibChangeTimeFilterProvider } from 'ui/filter_bar/lib/change_time_filter';
import { toKueryExpression, fromKueryExpression, toLegacyFilter, nodeTypes, filterToKueryAST } from 'ui/kuery';
import { IndexPatternsProvider } from '../index_patterns/index_patterns';

export function QueryManagerProvider(Private) {
  const mapAndFlattenFilters = Private(FilterBarLibMapAndFlattenFiltersProvider);
  const extractTimeFilter = Private(FilterBarLibExtractTimeFilterProvider);
  const changeTimeFilter = Private(FilterBarLibChangeTimeFilterProvider);
  const indexPatternService = Private(IndexPatternsProvider);

  return function (state) {

    function add(field, values = [], operation) {
      const fieldName = field.name;
      const indexPattern = field.indexPattern;
      const negate = operation === '-';
      const isExistsQuery = fieldName === '_exists_';
      const existingQuery = getQuery();

      if (!Array.isArray(values)) {
        values = [values];
      }

      const newQueries = values.map((value) => {
        const newQuery = isExistsQuery
          ? nodeTypes.function.buildNode('exists', value)
          : nodeTypes.function.buildNode('is', fieldName, value);

        return negate ? nodeTypes.function.buildNode('not', newQuery) : newQuery;
      });

      const allQueries = (_.isEmpty(state.query.query) && _.isEmpty(state.filters))
        ? newQueries
        : [existingQuery, ...newQueries];

      replaceQuery(nodeTypes.function.buildNode('and', allQueries, 'implicit'), indexPattern);
    }

    async function addLegacyFilter(filter) {
      // The filter_bar directive currently handles filter creation when lucene is the selected language,
      // so we only handle updating the kuery AST here.
      if (state.query.language === 'kuery') {
        const timeFilter = await extractTimeFilter([filter]);
        if (timeFilter) {
          changeTimeFilter(timeFilter);
        }
        else {
          const [ mappedFilter ] = await mapAndFlattenFilters([filter]);
          const newQuery = filterToKueryAST(mappedFilter);
          const allQueries = _.isEmpty(state.query.query)
            ? [newQuery]
            : [fromKueryExpression(state.query.query), newQuery];

          state.query = {
            query: toKueryExpression(nodeTypes.function.buildNode('and', allQueries, 'implicit')),
            language: 'kuery'
          };
        }
      }
    }

    function getQuery() {
      if (state.query.language === 'lucene') {
        const legacyFilters = state.filters || [];
        return nodeTypes.function.buildNode('and', legacyFilters.map(filterToKueryAST), 'implicit');
      }
      else if (state.query.language === 'kuery') {
        return fromKueryExpression(state.query.query);
      }
    }

    function replaceQuery(newQuery) {
      if (state.query.language === 'lucene') {
        state.filters = toLegacyFilter(newQuery, indexPatternService);
      }
      else if (state.query.language === 'kuery') {
        state.query = {
          query: toKueryExpression(newQuery),
          language: 'kuery',
        };
      }
    }

    return {
      add,
      addLegacyFilter,
      getQuery,
    };

  };
}
