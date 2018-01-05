import { uiModules } from 'ui/modules';
const module = uiModules.get('kibana');

/**
 * This directively automatically inserts matching pairs.
 * Specifically, it does the following:
 *
 * 1. If we don't have a multi-character selection, and the key is a closer,
 *    and the character in front of the cursor is the same, simply move the
 *    cursor forward.
 * 2. If the key is an opener, insert the opener at the beginning of the
 *    selection, and the closer at the end of the selection, and move the
 *    selection forward.
 * 3. If we don't have a multi-character selection, and the backspace is hit,
 *    and the characters before and after the cursor correspond to a pair,
 *    remove both characters and move the cursor backward.
 */

const pairs = ['()', '[]', '{}', `''`, '""'];
const openers = pairs.map(pair => pair[0]);
const closers = pairs.map(pair => pair[1]);

module.directive('matchPairs', () => ({
  restrict: 'A',
  require: 'ngModel',
  link: function (scope, elem, attrs, ngModel) {
    elem.on('keydown', (e) => {
      const { target, key } = e;
      const { value, selectionStart, selectionEnd } = target;
      if (selectionStart === selectionEnd && closers.includes(key) && value.charAt(selectionEnd) === key) {
        // 1. (See above)
        e.preventDefault();
        target.setSelectionRange(selectionStart + 1, selectionEnd + 1);
      } else if (
        openers.includes(key) && (
          // Don't match quotes following alphanumeric characters when there isn't a selection
          !['"', `'`].includes(key) ||
          selectionStart !== selectionEnd ||
          !(value.charAt(selectionStart - 1) || '').match(/[a-zA-Z0-9_]/)
        )
      ) {
        // 2. (See above)
        e.preventDefault();
        ngModel.$setViewValue(
          value.substr(0, selectionStart) + key +
          value.substring(selectionStart, selectionEnd) + closers[openers.indexOf(key)] +
          value.substr(selectionEnd)
        );
        ngModel.$render();
        target.setSelectionRange(selectionStart + 1, selectionEnd + 1);
      } else if (
        selectionStart === selectionEnd &&
        key === 'Backspace' &&
        !e.metaKey && pairs.includes(value.substr(selectionEnd - 1, 2))
      ) {
        // 3. (See above)
        e.preventDefault();
        ngModel.$setViewValue(value.substr(0, selectionEnd - 1) + value.substr(selectionEnd + 1));
        ngModel.$render();
        target.setSelectionRange(selectionStart - 1, selectionEnd - 1);
      }
    });
  }
}));
