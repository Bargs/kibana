import expect from 'expect.js';
import * as namedArg from '../named_arg';

describe('kuery node types', function () {

  describe('named arg', function () {

    describe('buildNode', function () {

      it('should return a node representing a named argument with the given value', function () {
        const result = namedArg.buildNode('fieldName', 'foo');
        expect(result).to.have.property('type', 'namedArg');
        expect(result).to.have.property('name', 'fieldName');
        expect(result).to.have.property('value');

        const literalValue = result.value;
        expect(literalValue).to.have.property('type', 'literal');
        expect(literalValue).to.have.property('value', 'foo');
      });

    });

    describe('toElasticsearchQuery', function () {

      it('should return the argument value represented by the given node', function () {
        const node = namedArg.buildNode('fieldName', 'foo');
        const result = namedArg.toElasticsearchQuery(node);
        expect(result).to.be('foo');
      });

    });

    describe('toKueryExpression', function () {

      it('should return the argument name and value represented by the given node', function () {
        const node = namedArg.buildNode('fieldName', 'foo');
        expect(namedArg.toKueryExpression(node)).to.be('fieldName="foo"');
      });

    });

  });

});
