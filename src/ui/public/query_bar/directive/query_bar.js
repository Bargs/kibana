import { uiModules } from 'ui/modules';
import { callAfterBindingsWorkaround } from 'ui/compat';
import template from './query_bar.html';
import suggestionTemplate from './suggestion.html';
import { queryLanguages } from '../lib/queryLanguages';
import { getSuggestionsProvider } from '../../kuery';
import './suggestion.less';
import '../../directives/documentation_href';
import '../../directives/match_pairs';

const module = uiModules.get('kibana');

module.directive('queryBar', function () {

  return {
    restrict: 'E',
    template: template,
    scope: {
      query: '=',
      appName: '=?',
      onSubmit: '&',
      disableAutoFocus: '=',
      indexPattern: '='
    },
    controllerAs: 'queryBar',
    bindToController: true,

    controller: callAfterBindingsWorkaround(function ($scope, $element, $http, $timeout, config, PersistedLog) {
      this.appName = this.appName || 'global';
      this.availableQueryLanguages = queryLanguages;
      this.showLanguageSwitcher = config.get('search:queryLanguage:switcher:enable');

      let persistedLog;
      let getSuggestions;

      this.submit = () => {
        if (this.localQuery.query) {
          persistedLog.add(this.localQuery.query);
        }
        this.onSubmit({ $query: this.localQuery });
      };

      this.selectLanguage = () => {
        this.localQuery.query = '';
        this.submit();
      };

      this.suggestionTemplate = suggestionTemplate;

      this.handleKeyDown = (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          this.updateSuggestions();
        }
      };

      this.updateSuggestions = () => {
        $timeout(() => {
          const inputEl = $element.find('input')[0];
          if (!inputEl) return;
          const { selectionStart, selectionEnd } = inputEl;
          const { query } = this.localQuery;
          return getSuggestions({ query, selectionStart, selectionEnd })
            .then(suggestions => {
              $scope.$apply(() => this.suggestions = suggestions);
            });
        });
      };

      // TODO: Figure out a better way to set selection
      this.onSuggestionSelect = ({ text, start, end }) => {
        const { query } = this.localQuery;
        const inputEl = $element.find('input')[0];
        this.localQuery.query = inputEl.value = query.substr(0, start) + text + query.substr(end);
        inputEl.setSelectionRange(start + text.length, start + text.length);
        inputEl.focus();
        this.updateSuggestions();
      };

      $scope.$watch('queryBar.localQuery.language', (language) => {
        persistedLog = new PersistedLog(`typeahead:${this.appName}-${language}`, {
          maxLength: config.get('history:limit'),
          filterDuplicates: true
        });
        const { indexPattern } = this;
        getSuggestions = getSuggestionsProvider({ $http, indexPattern, persistedLog });
        this.updateSuggestions();
      });

      $scope.$watch('queryBar.query', (newQuery) => {
        this.localQuery = {
          ...newQuery
        };
      }, true);
    })
  };
});
