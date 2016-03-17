import { keysToCamelCaseShallow, keysToSnakeCaseShallow } from '../../../plugins/kibana/common/lib/case_conversion';
import _ from 'lodash';
import angular from 'angular';
import chrome from 'ui/chrome';

export default function IngestProvider($rootScope, $http, config) {

  const ingestAPIPrefix = chrome.addBasePath('/api/kibana/ingest');

  this.save = function (indexPattern, pipeline) {
    if (_.isEmpty(indexPattern)) {
      throw new Error('index pattern is required');
    }

    const payload = {
      index_pattern: keysToSnakeCaseShallow(indexPattern)
    };
    if (!_.isEmpty(pipeline)) {
      payload.pipeline = _.map(pipeline, processor => keysToSnakeCaseShallow(processor));
    }

    return $http.post(`${ingestAPIPrefix}`, payload)
    .then(() => {
      if (!config.get('defaultIndex')) {
        config.set('defaultIndex', indexPattern.id);
      }

      $rootScope.$broadcast('ingest:updated');
    });
  };

  this.delete = function (ingestId) {
    if (_.isEmpty(ingestId)) {
      throw new Error('ingest id is required');
    }

    return $http.delete(`${ingestAPIPrefix}/${ingestId}`)
    .then(() => {
      $rootScope.$broadcast('ingest:updated');
    });
  };

  this.simulate = function (pipeline) {
    function pack(pipeline) {
      const result = keysToSnakeCaseShallow(pipeline);
      result.processors = _.map(result.processors, processor => keysToSnakeCaseShallow(processor));

      return result;
    }

    function unpack(response) {
      const data = response.data.map(result => keysToCamelCaseShallow(result));
      return data;
    }

    return $http.post(`${ingestAPIPrefix}/simulate`, pack(pipeline))
    .then(unpack)
    .catch(err => {
      throw ('Error communicating with Kibana server');
    });
  };

  this.bulk = function (file, indexPattern, delimiter, pipeline) {
    if (_.isUndefined(file)) {
      throw new Error('file is required')
    }
    if (_.isUndefined(indexPattern)) {
      throw new Error('index pattern is required')
    }
    
    const formData = new FormData();
    formData.append('csv', file);
    if (!_.isUndefined(delimiter)) {
      formData.append('delimiter', delimiter);
    }
    if (!_.isUndefined(pipeline)) {
      formData.append('pipeline', pipeline);
    }

    return $http.post(chrome.addBasePath(`/api/kibana/${indexPattern}/_bulk`), formData, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    });
  }

}
