import _ from 'lodash';
import { fromKueryExpression } from '../../../kuery';

function astToQuery(ast) {
  if (Array.isArray(ast)) {
    const query = {
      must: [],
      should: [],
      must_not: [],
    };

    ast.forEach((astClause) => {
      const clause = astToQuery(astClause);
      if (astClause.negate) {
        query.must_not.push(clause);
      }
      else {
        query.should.push(clause);
      }
    });

    return query;
  }
  else {
    if (ast.type === 'match') {
      return {
        match: {
          [ast.params.field]: ast.params.value
        }
      };
    }
    else if (ast.type === 'range') {
      return {
        range: {
          [ast.params.field]: {
            gt: ast.params.gt,
            lt: ast.params.lt
          }
        }
      };
    }
  }
}

export function buildQueryFromKuery(queries) {
  const queryASTs = _.map(queries, query => fromKueryExpression(query.query));
  const combinedQueryASTs = _.flatten(queryASTs);
  const kueryQuery = astToQuery(combinedQueryASTs);
  return kueryQuery;
}


