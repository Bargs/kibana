import grammar from 'raw!./kuery.peg';
import PEG from 'pegjs';
import _ from 'lodash';
import { nodeTypes } from './node_types';

const kueryParser = PEG.buildParser(grammar);

export function fromKueryExpression(expression) {
  if (_.isUndefined(expression)) {
    throw new Error('expression must be a string, got undefined instead');
  }

  return kueryParser.parse(expression);
}

export function toKueryExpression(node) {
  if (!node || !node.type) {
    return '';
  }

  return nodeTypes[node.type].toKueryExpression(node);
}

export function toElasticsearchQuery(node, indexPattern) {
  if (!node || !node.type) {
    return toElasticsearchQuery(nodeTypes.function.buildNode('and', false, []));
  }

  return nodeTypes[node.type].toElasticsearchQuery(node, indexPattern);
}

export function addNode(node, newNode) {
  if (!_.has(nodeTypes[node.type], 'addNode')) {
    throw new Error(`Cannot append to nodes of type ${node.type}`);
  }

  return nodeTypes[node.type].addNode(node, newNode);
}
