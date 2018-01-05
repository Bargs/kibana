import _ from 'lodash';

function isSortable(field, indexPattern) {
  return (indexPattern.fields.byName[field] && indexPattern.fields.byName[field].sortable);
}

function createSortObject(sortPair, indexPattern) {

  if (Array.isArray(sortPair) && sortPair.length === 2 && isSortable(sortPair[0], indexPattern)) {
    const [ field, direction ] = sortPair;
    return { [field]: direction };
  }
  else {
    return undefined;
  }
}

/**
 * Take a sorting array and make it into an object
 * @param {array} sort 2 item array [fieldToSort, directionToSort]
 * @param {object} indexPattern used for determining default sort
 * @returns {object} a sort object suitable for returning to elasticsearch
 */
export function getSort(sort, indexPattern, defaultSortOrder = 'desc') {

  let sortObjects;
  if (Array.isArray(sort)) {
    if (sort.length > 0 && !Array.isArray(sort[0])) {
      sort = [sort];
    }
    sortObjects = _.compact(sort.map((sortPair) => createSortObject(sortPair, indexPattern)));
  }

  if (!_.isEmpty(sortObjects)) {
    return sortObjects;
  }
  else if (indexPattern.timeFieldName && isSortable(indexPattern.timeFieldName, indexPattern)) {
    return [{ [indexPattern.timeFieldName]: defaultSortOrder }];
  }
  else {
    return [{ _score: 'desc' }];
  }
}

getSort.array = function (sort, indexPattern, defaultSortOrder) {
  return getSort(sort, indexPattern, defaultSortOrder).map((sortPair) => _(sortPair).pairs().pop());
};

