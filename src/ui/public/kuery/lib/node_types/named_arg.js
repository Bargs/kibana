import * as ast from '../ast';
import { nodeTypes } from '../node_types';

export function buildNode(name, value) {
  return {
    type: 'namedArg',
    name,
    value: nodeTypes.literal.buildNode(value),
  };
}

export function toElasticsearchQuery(node) {
  return ast.toElasticsearchQuery(node.value);
}

export function toKueryExpression(node) {
  return `${node.name}=${ast.toKueryExpression(node.value)}`;
}
