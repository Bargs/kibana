import '../filters/short_dots';
import _ from 'lodash';
import errors from '../errors';
import IndexPatternsIndexPatternProvider from '../index_patterns/_index_pattern';
import IndexPatternsPatternCacheProvider from '../index_patterns/_pattern_cache';
import IndexPatternsGetIdsProvider from '../index_patterns/_get_ids';
import IndexPatternsIntervalsProvider from '../index_patterns/_intervals';
import IndexPatternsMapperProvider from '../index_patterns/_mapper';
import IndexPatternsPatternToWildcardProvider from '../index_patterns/_pattern_to_wildcard';
import RegistryFieldFormatsProvider from '../registry/field_formats';
import uiModules from '../modules';
let module = uiModules.get('kibana/index_patterns');

function IndexPatternsProvider(es, Notifier, Private, Promise, kbnIndex) {
  let self = this;

  let IndexPattern = Private(IndexPatternsIndexPatternProvider);
  let patternCache = Private(IndexPatternsPatternCacheProvider);

  let notify = new Notifier({ location: 'IndexPatterns Service'});

  self.get = function (id) {
    if (!id) return self.make();

    let cache = patternCache.get(id);
    return cache || patternCache.set(id, self.make(id));
  };

  self.make = function (id) {
    return (new IndexPattern(id)).init();
  };

  self.delete = function (pattern) {
    self.getIds.clearCache();
    pattern.destroy();

    return es.delete({
      index: kbnIndex,
      type: 'index-pattern',
      id: pattern.id
    });
  };

  self.errors = {
    MissingIndices: errors.IndexPatternMissingIndices
  };

  self.cache = patternCache;
  self.getIds = Private(IndexPatternsGetIdsProvider);
  self.intervals = Private(IndexPatternsIntervalsProvider);
  self.mapper = Private(IndexPatternsMapperProvider);
  self.patternToWildcard = Private(IndexPatternsPatternToWildcardProvider);
  self.fieldFormats = Private(RegistryFieldFormatsProvider);
  self.IndexPattern = IndexPattern;
}

module.service('indexPatterns', Private => Private(IndexPatternsProvider));
export default IndexPatternsProvider;
