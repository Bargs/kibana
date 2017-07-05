import _ from 'lodash';

export function buildQueryFromLucene(queries, decorateQuery) {
  const combinedQueries = _.map(queries, (query) => {
    if (_.isString(query.query)) {
      if (query.query.trim() === '') {
        return { match_all: {} };
      }
      return decorateQuery({ query_string: { query: query.query } });
    }

    return decorateQuery(query.query);
  });

  return {
    must: [].concat(combinedQueries),
    filter: [],
    should: [],
    must_not: [],
  };
}
