import { fromKueryExpression, toKueryExpression } from '../ast';
import expect from 'expect.js';

describe('kuery', function () {

  let ast;
  beforeEach(function kueryBeforeEach() {
    ast = [
      {
        type: 'match',
        negate: false,
        params: {
          field: 'foo',
          value: 'bar',
        }
      },
      {
        type: 'match',
        negate: false,
        params: {
          field: 'bar',
          value: 'baz',
        }
      }
    ];
  });

  describe('kuery serialization', function () {

    it('should serialize things', function () {
      const expected = 'foo:bar bar:baz';
      const result = toKueryExpression(ast);
      expect(result).to.eql(expected);
    });

    it('should prefix the clause with "-" for a negative filter', function () {
      const expected = '-foo:bar bar:baz';
      ast[0].negate = true;
      const result = toKueryExpression(ast);
      expect(result).to.eql(expected);
    });

  });


  describe('kuery deserialization', function () {

    it('should parse a kuery expression into ast', function () {
      const parseResult = fromKueryExpression('foo:bar bar:baz');

      expect(parseResult).to.eql(ast);
    });

    it('should negate ast with a - in front of their clause', function () {
      ast[0].negate = true;
      const parseResult = fromKueryExpression('-foo:bar bar:baz');

      expect(parseResult).to.eql(ast);
    });
  });

});
