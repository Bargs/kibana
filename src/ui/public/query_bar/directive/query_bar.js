import { uiModules } from 'ui/modules';
import { callAfterBindingsWorkaround } from 'ui/compat';
import template from './query_bar.html';
import { queryLanguages } from '../lib/queryLanguages';
import { documentationLinks } from '../../documentation_links/documentation_links.js';
import { SavedObjectsClientProvider } from '../../saved_objects';

const module = uiModules.get('kibana');

module.directive('queryBar', function () {

  return {
    restrict: 'E',
    template: template,
    scope: {
      query: '=',
      appName: '=?',
      onSubmit: '&',
      disableAutoFocus: '='
    },
    controllerAs: 'queryBar',
    bindToController: true,
    controller: callAfterBindingsWorkaround(function ($scope, config, Private) {
      const savedObjectsClient = Private(SavedObjectsClientProvider);
      this.queryDocLinks = documentationLinks.query;
      this.appName = this.appName || 'global';
      this.availableQueryLanguages = queryLanguages;
      this.showLanguageSwitcher = config.get('search:queryLanguage:switcher:enable');
      this.typeaheadKey = () => `${this.appName}-${this.query.language}`;
      this.showSaveLoad = false;

      const getSavedQueries = () => {
        savedObjectsClient.find({
          type: 'query',
          perPage: 10,
          search: `*`,
        }).then(response => {
          this.savedQueries = response.savedObjects;
        });
      };

      this.submit = () => {
        this.onSubmit({ $query: this.localQuery });
      };

      this.selectLanguage = () => {
        this.localQuery.query = '';
        this.submit();
      };

      this.toggleSaveLoad = () => {
        this.showSaveLoad = !this.showSaveLoad;
      };

      this.saveQuery = () => {
        const attributes = Object.assign({}, this.localQuery, { name: this.saveQueryName });

        savedObjectsClient.create('query', attributes)
        .then(getSavedQueries);
      };

      this.loadQuery = (savedQuery) => {
        this.localQuery = savedQuery.attributes;
        this.submit();
      };

      $scope.$watch('queryBar.query', (newQuery) => {
        this.localQuery = Object.assign({}, newQuery);
      }, true);

      getSavedQueries();
    })
  };

});
