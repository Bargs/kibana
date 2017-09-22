export class FilterManager {

  constructor(fieldName, indexPattern, kbnAPI, unsetValue) {
    this.fieldName = fieldName;
    this.indexPattern = indexPattern;
    this.queryFilter = kbnAPI.queryFilter;
    this.queryManager = kbnAPI.queryManager;
    this.kuery = kbnAPI.kuery;
    this.unsetValue = unsetValue;
  }

  createFilter() {
    throw new Error('Must implement createFilter.');
  }

  findFilters() {
    throw new Error('Must implement findFilters.');
  }

  getValueFromFilterBar() {
    throw new Error('Must implement getValueFromFilterBar.');
  }

  getUnsetValue() {
    return this.unsetValue;
  }
}
