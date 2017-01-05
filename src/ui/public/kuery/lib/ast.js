import grammar from 'raw!./kuery.peg';
import PEG from 'pegjs';
import _ from 'lodash';

const kueryParser = PEG.buildParser(grammar);

export function fromKueryExpression(expression) {
  if (_.isUndefined(expression)) {
    throw new Error('expression must be a string, got undefined instead');
  }

  return kueryParser.parse(expression);
}

export function toKueryExpression(ast) {
  if (!Array.isArray(ast)) throw new Error('AST must be an array');

  return ast.reduce((acc, node) => {
    return `${acc} ${stringifyNode(node)}`;
  }, '').trim();
}

function stringifyNode(node) {
  if (!node || !node.type) return '';

  let retVal = '';
  if (node.negate) retVal += '-';

  switch (node.type) {
    case 'match':
      retVal += `${node.params.field}:${node.params.value}`;
      break;
  }

  return retVal;
}

function addNode(ast, node) {
  return ast.concat(node);
}

function buildMatchNode({ field, values, operation }) {
  const negate = operation === '-';

  return {
    type: 'match',
    negate,
    params: {
      field,
      value: values
    }
  };
}

export const kueryASTUtils = {
  addNode,
  buildMatchNode,
};
