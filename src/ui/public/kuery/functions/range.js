import _ from 'lodash';
import { nodeTypes } from '../node_types';
import * as ast from '../ast';
import { getRangeScript } from 'ui/filter_manager/lib/range';

// Copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function buildNodeParams(fieldName, params, serializeStyle = 'operator') {
  params = _.pick(params, 'gt', 'lt', 'gte', 'lte', 'format');
  const fieldNameArg = nodeTypes.literal.buildNode(fieldName);
  const args = _.map(params, (value, key) => {
    return nodeTypes.namedArg.buildNode(key, value);
  });

  // we only support inclusive ranges in the operator syntax currently
  if (_.has(params, 'gt') || _.has(params, 'lt')) {
    serializeStyle = 'function';
  }

  return {
    arguments: [fieldNameArg, ...args],
    serializeStyle,
  };
}

function getFieldsByWildcard(pattern, indexPattern) {
  if (pattern.includes('*')) {
    const userInputLiterals = pattern.split('*');
    const escapedUserInputLiterals = userInputLiterals.map(escapeRegExp);
    const regexPattern = escapedUserInputLiterals.join('.*');
    const regex = new RegExp(regexPattern);

    const fields = indexPattern.fields.filter((field) => {
      return regex.test(field.name);
    });

    if (_.isEmpty(fields)) {
      throw new Error(`No fields match the pattern ${pattern}`);
    }

    return fields;
  }
  else {
    return [indexPattern.fields.byName[pattern]];
  }
}

function createRangeDSL(field, queryParams) {
  if (field && field.scripted) {
    return {
      script: {
        ...getRangeScript(field, queryParams)
      }
    };
  }

  return {
    range: {
      [field.name]: queryParams
    }
  };
}

export function toElasticsearchQuery(node, indexPattern) {
  const [ fieldNameArg, ...args ] = node.arguments;
  const fieldName = nodeTypes.literal.toElasticsearchQuery(fieldNameArg);
  const fields = getFieldsByWildcard(fieldName, indexPattern);
  const namedArgs = extractArguments(args);
  const queryParams = _.mapValues(namedArgs, ast.toElasticsearchQuery);

  if (fields.length === 1) {
    return createRangeDSL(fields[0], queryParams);
  }
  else {
    return {
      bool: {
        filter: fields.map(field => createRangeDSL(field, queryParams))
      }
    };
  }
}

export function toKueryExpression(node) {
  if (node.serializeStyle !== 'operator') {
    throw new Error(`Cannot serialize "range" function as "${node.serializeStyle}"`);
  }
  const [ fieldNameArg, ...args ] = node.arguments;
  const fieldName = ast.toKueryExpression(fieldNameArg);
  const { gte, lte } = extractArguments(args);

  if (_.isUndefined(gte) || _.isUndefined(lte)) {
    throw new Error(`Operator syntax only supports inclusive ranges`);
  }

  return `${fieldName}:[${ast.toKueryExpression(gte)} to ${ast.toKueryExpression(lte)}]`;
}

function extractArguments(args) {
  if ((args.gt && args.gte) || (args.lt && args.lte)) {
    throw new Error('range ends cannot be both inclusive and exclusive');
  }

  const unnamedArgOrder = ['gte', 'lte', 'format'];

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
