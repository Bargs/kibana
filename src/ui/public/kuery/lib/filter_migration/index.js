import _ from 'lodash';
import { kueryASTUtils } from 'ui/kuery';

export function filterToKueryAST(filter) {
  const ast = convertMatchFilter(filter);
  if (!ast) {
    throw new Error(`Couldn't convert that filter to a kuery`);
  }

  return ast;
}

function convertMatchFilter(filter) {
  if (!filter.query || !filter.query.match) return;

  const key = _.keys(filter.query.match)[0];
  const value = filter.query.match[key].query;
  const operation = _.get(filter, 'meta.negate') ? '-' : '+';
  return kueryASTUtils.buildMatchNode({ field: key, values: value, operation });
}
