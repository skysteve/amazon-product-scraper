import 'mocha';

import chai from 'chai';
import createServer from '../../src/server';
import sinonChai from 'sinon-chai';
import supertest from 'supertest';
import supertestAgent from 'supertest-koa-agent';

chai.use(sinonChai);
// const expect = chai.expect;

describe('/product', () => {
  let server: any;
  let request: supertest.SuperTest<supertest.Test>;

  before(() => {
    return server = createServer()
      .then((s) => {
        server = s;
        request = supertestAgent(server);
      });
  });

  describe('/product/:asin', () => {
    it('should return 404 if no product asin is specified', () => {
      return request.get('/product')
          .expect(404);
    });

  });
});
