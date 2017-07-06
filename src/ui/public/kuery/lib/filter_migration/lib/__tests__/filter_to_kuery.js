import expect from 'expect.js';
import { filterToKueryAST } from '../filter_to_kuery';

describe('filter to kuery migration', function () {

  describe('filterToKueryAST', function () {

    it('should hand off conversion of known filter types to the appropriate converter', function () {
      const filter = {
        meta: {
          type: 'exists',
          key: 'foo',
        }
      };
      const result = filterToKueryAST(filter);

      expect(result).to.have.property('type', 'function');
      expect(result).to.have.property('function', 'exists');
    });

    it('should thrown an error when an unknown filter type is encountered', function () {
      const filter = {
        meta: {
          type: 'foo',
        }
      };

      expect(filterToKueryAST).withArgs(filter).to.throwException(/Couldn't convert that filter to a kuery/);
    });

    it('should wrap the AST node of negated filters in a "not" function', function () {
      const filter = {
        meta: {
          type: 'exists',
          key: 'foo',
          negate: true,
        }
      };
      const result = filterToKueryAST(filter);

      expect(result).to.have.property('type', 'function');
      expect(result).to.have.property('function', 'not');
    });

  });

});
