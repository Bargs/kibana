import _ from 'lodash';
import { functions } from '../functions';
import { nodeTypes } from '../node_types';

export function buildNode(functionName, ...functionArgs) {
  const kueryFunction = functions[functionName];

  return {
    type: 'function',
    function: functionName,
    ...kueryFunction.buildNodeParams(...functionArgs)
  };
}

export function toElasticsearchQuery(node, indexPattern) {
  const kueryFunction = functions[node.function];
  return kueryFunction.toElasticsearchQuery(node, indexPattern);
}

export function toKueryExpression(node) {
  const kueryFunction = functions[node.function];

  if (!_.isUndefined(node.text)) {
    return node.text;
  }

  if (node.serializeStyle && node.serializeStyle !== 'function') {
    return kueryFunction.toKueryExpression(node);
  }

  const functionArguments = (node.arguments || []).map((argument) => {
    return nodeTypes[argument.type].toKueryExpression(argument);
  });

  return `${node.function}(${functionArguments.join(', ')})`;
}
