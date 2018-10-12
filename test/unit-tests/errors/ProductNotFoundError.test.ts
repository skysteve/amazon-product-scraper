import 'mocha';

import chai from 'chai';
import {ProductNotFoundError} from '../../../src/errors/ProductNotFoundError';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
const expect = chai.expect;

describe('ProductNotFoundError', () => {
  it('should set the error message correctly', () => {
    const error = new ProductNotFoundError('myASIN');
    expect(error.message).to.equal('Failed too find the product with ASIN "myASIN"');
    expect(error.type).to.equal('ProductNotFoundError');
  });
});
