import 'mocha';

import chai from 'chai';
import Product from '../../../src/models/Product';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
const expect = chai.expect;

describe('models -> Product', () => {

  describe('toResponse', () => {
    it('should remap the _id to be id', () => {
      const dateUpdated = new Date();
      const product = new Product({
        _id: 'MY_ASIN',
        category: 'MY_CATEGORY',
        dimensions: '1x2m',
        deleted: false,
        title: 'MY_PRODUCT',
        rank: ['#1 in MY_CATEGORY'],
        lastUpdated: dateUpdated
      });

      const response = (product as any).toResponse();

      expect(response).to.deep.equal({
        id: 'MY_ASIN',
        category: 'MY_CATEGORY',
        dimensions: '1x2m',
        deleted: false,
        title: 'MY_PRODUCT',
        rank: ['#1 in MY_CATEGORY'],
        lastUpdated: dateUpdated
      });
    });
  });
});
