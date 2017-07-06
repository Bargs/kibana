import _ from 'lodash';
import { nodeTypes } from '../node_types';
import * as ast from '../ast';
import { getRangeScript } from 'ui/filter_manager/lib/range';

export function buildNodeParams(fieldName, params, serializeStyle = 'shorthand') {
  params = _.pick(params, 'gt', 'lt', 'gte', 'lte');
  const fieldNameArg = nodeTypes.literal.buildNode(fieldName);
  const args = _.pairs(params).map((argument) => {
    const [ name, value ] = argument;
    return nodeTypes.namedArg.buildNode(name, value);
  });

  // we only support inclusive ranges in the shorthand syntax currently
  if (_.has(params, 'gt') || _.has(params, 'lt')) {
    serializeStyle = 'function';
  }

  return {
    arguments: [fieldNameArg, ...args],
    serializeStyle,
  };
}

export function toElasticsearchQuery(node, indexPattern) {
  const [ fieldNameArg, ...args ] = node.arguments;
  const fieldName = ast.toElasticsearchQuery(fieldNameArg);
  const field = indexPattern.fields.byName[fieldName];
  const namedArgs = extractArguments(args);
  const queryParams = _.mapValues(namedArgs, ast.toElasticsearchQuery);

  if (field && field.scripted) {
    return {
      script: {
        ...getRangeScript(field, queryParams)
      }
    };
  }

  return {
    range: {
      [fieldName]: queryParams
    }
  };
}

export function toKueryExpression(node) {
  if (node.serializeStyle !== 'shorthand') {
    throw new Error(`Cannot serialize "range" function as "${node.serializeStyle}"`);
  }
  const [ fieldNameArg, ...args ] = node.arguments;
  const fieldName = ast.toKueryExpression(fieldNameArg);
  const { gte, lte } = extractArguments(args);

  if (_.isUndefined(gte) || _.isUndefined(lte)) {
    throw new Error(`Shorthand syntax only supports inclusive ranges`);
  }

  return `${fieldName}:[${ast.toKueryExpression(gte)} to ${ast.toKueryExpression(lte)}]`;
}

function extractArguments(args) {
  if ((args.gt && args.gte) || (args.lt && args.lte)) {
    throw new Error('range ends cannot be both inclusive and exclusive');
  }

  const unnamedArgOrder = ['gte', 'lte'];

  return args.reduce((acc, arg, index) => {
    if (arg.type === 'namedArg') {
      acc[arg.name] = arg.value;
    }
    else {
      acc[unnamedArgOrder[index]] = arg;
    }

    return acc;
  }, {});
}
