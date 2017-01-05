import _ from 'lodash';

export function ParseQueryLibFromUserProvider() {

  /**
   * Take text from the user and make it into a query object
   * @param {text} user's query input
   * @returns {object}
   */
  return function (text) {
    const matchAll = '';

    if (_.isObject(text)) {
      // If we get an empty object, treat it as a *
      if (!Object.keys(text).length) {
        return matchAll;
      }
      return text;
    }

    // Nope, not an object.
    text = (text || '').trim();
    if (text.length === 0) return matchAll;

    if (text[0] === '{') {
      try {
        return JSON.parse(text);
      } catch (e) {
        return text;
      }
    } else {
      return text;
    }
  };
}

