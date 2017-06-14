import _ from 'lodash';
import { compareFilters } from '../filter_bar/lib/compare_filters.js';
import { FilterBarQueryFilterProvider } from '../filter_bar/query_filter';

export function QueryManagerProvider(Private) {
  const queryFilter = Private(FilterBarQueryFilterProvider);

  function addAndInvertLegacyFilters(state, filters) {
    const { filters: existingFilters } = state;

    const inversionFilters = _.filter(existingFilters, (existingFilter) => {
      const newMatchingFilter = _.find(filters, _.partial(compareFilters, existingFilter));
      return newMatchingFilter
        && newMatchingFilter.meta
        && existingFilter.meta
        && existingFilter.meta.negate !== newMatchingFilter.meta.negate;
    });
    const newFilters = _.reject(filters, (filter) => {
      return _.find(inversionFilters, _.partial(compareFilters, filter));
    });

    _.forEach(inversionFilters, invertLegacyFilter);
    addLegacyFilters(newFilters);
  }

  function invertLegacyFilter(filter) {
    return queryFilter.invertFilter(filter);
  }

  function addLegacyFilters(filters) {
    return queryFilter.addFilters(filters);
  }

  return {
    addAndInvertLegacyFilters
  };
}
