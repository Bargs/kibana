import * as ast from '../ast';

export function buildNode(name, value) {
  return {
    type: 'namedArg',
    name,
    value,
  };
}

export function toElasticsearchQuery(node) {
  return ast.toElasticsearchQuery(node.value);
}

export function toKueryExpression(node) {
  return `${node.name}=${ast.toKueryExpression(node.value)}`;
}
