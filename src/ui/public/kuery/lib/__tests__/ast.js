import * as ast from '../ast';
import _ from 'lodash';
import expect from 'expect.js';
import { nodeTypes } from '../node_types';
import StubbedLogstashIndexPatternProvider from 'fixtures/stubbed_logstash_index_pattern';
import ngMock from 'ng_mock';

// expect.js's `eql` method provides nice error messages but sometimes misses things
// since it only tests loose (==) equality. This function uses lodash's `isEqual` as a
// second sanity check since it checks for strict equality.
function expectDeepEqual(actual, expected) {
  expect(actual).to.eql(expected);
  expect(_.isEqual(actual, expected)).to.be(true);
}

// Helpful utility allowing us to test the PEG parser by simply checking for deep equality between
// the nodes the parser generates and the nodes our constructor functions generate.
function fromKueryExpressionNoMeta(text) {
  return ast.fromKueryExpression(text, { includeMetadata: false });
}

let indexPattern;

describe('kuery AST API', function () {

  beforeEach(ngMock.module('kibana'));
  beforeEach(ngMock.inject(function (Private) {
    indexPattern = Private(StubbedLogstashIndexPatternProvider);
  }));

  describe('fromKueryExpression', function () {

    it('should return location and text metadata for each AST node', function () {
      const notNode = ast.fromKueryExpression('-foo:bar');
      expect(notNode).to.have.property('text', '-foo:bar');
      expect(notNode.location).to.eql({ min: 0, max: 8 });

      const isNode = notNode.arguments[0];
      expect(isNode).to.have.property('text', 'foo:bar');
      expect(isNode.location).to.eql({ min: 1, max: 8 });

      const { arguments: [ argNode1, argNode2 ] } = isNode;
      expect(argNode1).to.have.property('text', 'foo');
      expect(argNode1.location).to.eql({ min: 1, max: 4 });

      expect(argNode2).to.have.property('text', 'bar');
      expect(argNode2.location).to.eql({ min: 5, max: 8 });
    });

    it('should return a match all "is" function for whitespace', function () {
      const expected = nodeTypes.function.buildNode('is', '*');
      const actual = fromKueryExpressionNoMeta('  ');
      expectDeepEqual(actual, expected);
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
