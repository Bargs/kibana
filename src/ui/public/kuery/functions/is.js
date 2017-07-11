import _ from 'lodash';
import * as literal from '../node_types/literal';
import { getPhraseScript } from 'ui/filter_manager/lib/phrase';

export function buildNodeParams(fieldName, value, serializeStyle = 'operator') {
  return {
    arguments: [literal.buildNode(fieldName), literal.buildNode(value)],
    serializeStyle
  };
}

export function toElasticsearchQuery(node, indexPattern) {
  const { arguments:  [ fieldNameArg, valueArg ] } = node;
  const fieldName = literal.toElasticsearchQuery(fieldNameArg);
  const field = indexPattern.fields.byName[fieldName];
  const value = !_.isUndefined(valueArg) ? literal.toElasticsearchQuery(valueArg) : valueArg;

  if (field && field.scripted) {
    return {
      script: {
        ...getPhraseScript(field, value)
      }
    };
  }
  else if (fieldName === '*' && _.isUndefined(value)) {
    return { match_all: {} };
  }
  else if (fieldName === '*' && !_.isUndefined(value)) {
    const userQuery = String(value);
    const query = isDoubleQuoted(userQuery) ? userQuery : `"${userQuery}"`;

    return {
      simple_query_string: {
        query,
        all_fields: true
      }
    };
  }
  else if (fieldName !== '*' && _.isUndefined(value)) {
    return {
      exists: { field: fieldName }
    };
  }
  else {
    return {
      match_phrase: {
        [fieldName]: value
      }
    };
  }
}

export function toKueryExpression(node) {
  if (node.serializeStyle !== 'operator') {
    throw new Error(`Cannot serialize "is" function as "${node.serializeStyle}"`);
  }

  const { arguments:  [ fieldNameArg, valueArg ] } = node;
  const fieldName = literal.toKueryExpression(fieldNameArg);
  const value = !_.isUndefined(valueArg) ? literal.toKueryExpression(valueArg) : valueArg;

  return `${fieldName}:${value}`;
}

function isDoubleQuoted(str) {
  return (_.first(str) === '"') && (_.last(str) === '"');
}

