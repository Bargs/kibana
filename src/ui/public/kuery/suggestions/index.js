import { flatten, mapValues } from 'lodash';
import { fromKueryExpression } from '../ast';
import { getSuggestionsProvider as field } from './field';
import { getSuggestionsProvider as value } from './value';
import { getSuggestionsProvider as operator } from './operator';
import { getSuggestionsProvider as conjunction } from './conjunction';

const cursor = '\0';

export function getSuggestionsProvider({ $http, config, indexPatterns }) {
  const getSuggestionsByType = mapValues({ field, value, operator, conjunction }, provider => {
    return provider({ $http, config, indexPatterns });
  });

  return function getSuggestions({ query, selectionStart, selectionEnd }) {
    const cursoredQuery = `${query.substr(0, selectionStart)}${cursor}${query.substr(selectionEnd)}`;

    let cursorNode;
    try {
      cursorNode = fromKueryExpression(cursoredQuery, { parseCursor: true });
    } catch (e) {
      cursorNode = {};
    }

    const { suggestionTypes = [] } = cursorNode;
    const suggestionsByType = suggestionTypes.map(type => {
      return getSuggestionsByType[type](cursorNode);
    });
    return Promise.all(suggestionsByType)
      .then(suggestionsByType => flatten(suggestionsByType));
  };
}
