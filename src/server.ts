import Koa from 'koa';
import Router from 'koa-router';

import * as products from './endpoints/products';

function registerRoutes(router: Router) {
  router.get('/product/:asin', products.handler);
}

export default async function createServer(): Promise<Koa> {
  const router = new Router();
  registerRoutes(router);
  const app = new Koa();

  app.use(router.routes())
  .use(router.allowedMethods());

  return app;
};
