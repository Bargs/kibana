import * as ast from '../ast';
import _ from 'lodash';
import expect from 'expect.js';
import { nodeTypes } from '../node_types';
import StubbedLogstashIndexPatternProvider from 'fixtures/stubbed_logstash_index_pattern';
import ngMock from 'ng_mock';

let indexPattern;

describe('kuery AST API', function () {

  beforeEach(ngMock.module('kibana'));
  beforeEach(ngMock.inject(function (Private) {
    indexPattern = Private(StubbedLogstashIndexPatternProvider);
  }));

  describe('fromKueryExpression', function () {

    it('should foo', function () {
      throw new Error('implement me');
    });

  });

  describe('toKueryExpression', function () {

    it('should return the given node type\'s kuery string representation', function () {
      const node = nodeTypes.function.buildNode('exists', 'foo');
      const expected = nodeTypes.function.toKueryExpression(node);
      const result = ast.toKueryExpression(node);
      expect(_.isEqual(expected, result)).to.be(true);
    });

    it('should return an empty string for undefined nodes and unknown node types', function () {
      expect(ast.toKueryExpression()).to.be('');

      const node = nodeTypes.function.buildNode('exists', 'foo');
      delete node.type;
      expect(ast.toKueryExpression(node)).to.be('');
    });

  });

  describe('toElasticsearchQuery', function () {

    it('should return the given node type\'s ES query representation', function () {
      const node = nodeTypes.function.buildNode('exists', 'response');
      const expected = nodeTypes.function.toElasticsearchQuery(node, indexPattern);
      const result = ast.toElasticsearchQuery(node, indexPattern);
      expect(_.isEqual(expected, result)).to.be(true);
    });

    it('should return an empty "and" function for undefined nodes and unknown node types', function () {
      const expected = nodeTypes.function.toElasticsearchQuery(nodeTypes.function.buildNode('and', []));

      expect(_.isEqual(ast.toElasticsearchQuery(), expected)).to.be(true);

      const node = nodeTypes.function.buildNode('exists', 'foo');
      delete node.type;
      expect(_.isEqual(ast.toElasticsearchQuery(node), expected)).to.be(true);
    });

  });

});
