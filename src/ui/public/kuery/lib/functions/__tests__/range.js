import expect from 'expect.js';
import * as range from '../range';
import { nodeTypes } from '../../node_types';
import _ from 'lodash';
import StubbedLogstashIndexPatternProvider from 'fixtures/stubbed_logstash_index_pattern';
import ngMock from 'ng_mock';

let indexPattern;

describe('kuery functions', function () {

  describe('range', function () {

    beforeEach(ngMock.module('kibana'));
    beforeEach(ngMock.inject(function (Private) {
      indexPattern = Private(StubbedLogstashIndexPatternProvider);
    }));

    describe('buildNodeParams', function () {

      it('should return "arguments" and "serializeStyle" params', function () {
        const result = range.buildNodeParams('bytes', { gt: 1000, lt: 8000 });
        expect(result).to.only.have.keys('arguments', 'serializeStyle');
      });

      it('arguments should contain the provided fieldName as a literal', function () {
        const result = range.buildNodeParams('bytes', { gt: 1000, lt: 8000 });
        const { arguments: [ fieldName ] } = result;

        expect(fieldName).to.have.property('type', 'literal');
        expect(fieldName).to.have.property('value', 'bytes');
      });

      it('arguments should contain the provided params as named arguments', function () {
        const givenParams = { gt: 1000, lt: 8000 };
        const result = range.buildNodeParams('bytes', givenParams);
        const { arguments: [ , ...params ] } = result;

        params.map((param) => {
          expect(param).to.have.property('type', 'namedArg');
          expect(['gt', 'lt'].includes(param.name)).to.be(true);
          expect(param.value.type).to.be('literal');
          expect(param.value.value).to.be(givenParams[param.name]);
        });
      });

      it('serializeStyle should default to "shorthand"', function () {
        const result = range.buildNodeParams('bytes', { gte: 1000, lte: 8000 });
        const { serializeStyle } = result;
        expect(serializeStyle).to.be('shorthand');
      });

      it('serializeStyle should be "function" if either end of the range is exclusive', function () {
        const result = range.buildNodeParams('bytes', { gt: 1000, lt: 8000 });
        const { serializeStyle } = result;
        expect(serializeStyle).to.be('function');
      });

    });

    describe('toElasticsearchQuery', function () {

      it('should return an ES range query for the node\'s field and params', function () {
        const expected = {
          range: {
            bytes: {
              gt: 1000,
              lt: 8000
            }
          }
        };

        const node = nodeTypes.function.buildNode('range', 'bytes', { gt: 1000, lt: 8000 });
        const result = range.toElasticsearchQuery(node, indexPattern);
        expect(_.isEqual(expected, result)).to.be(true);
      });

      it('should support scripted fields', function () {
        const node = nodeTypes.function.buildNode('range', 'script number', { gt: 1000, lt: 8000 });
        const result = range.toElasticsearchQuery(node, indexPattern);
        expect(result).to.have.key('script');
      });

    });

    describe('toKueryExpression', function () {

      it('should serialize "range" nodes with a shorthand syntax', function () {
        const node = nodeTypes.function.buildNode('range', 'bytes', { gte: 1000, lte: 8000 }, 'shorthand');
        const result = range.toKueryExpression(node);
        expect(result).to.be('"bytes":[1000 to 8000]');
      });

      it('should throw an error for nodes with unknown or undefined serialize styles', function () {
        const node = nodeTypes.function.buildNode('range', 'bytes', { gte: 1000, lte: 8000 }, 'notValid');
        expect(range.toKueryExpression)
        .withArgs(node).to.throwException(/Cannot serialize "range" function as "notValid"/);
      });

      it('should not support exclusive ranges in the shorthand syntax', function () {
        const node = nodeTypes.function.buildNode('range', 'bytes', { gt: 1000, lt: 8000 });
        node.serializeStyle = 'shorthand';
        expect(range.toKueryExpression)
        .withArgs(node).to.throwException(/Shorthand syntax only supports inclusive ranges/);
      });

    });
  });
});
