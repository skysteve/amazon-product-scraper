import config from 'config';
import Koa from 'koa';
import Router from 'koa-router';
import mongoose from 'mongoose';

import * as products from './endpoints/products';

function registerRoutes(router: Router) {
  router.get('/product/:asin', products.handler);
}

export default async function createServer(): Promise<Koa> {
  const router = new Router();
  registerRoutes(router);
  const app = new Koa();

  mongoose.connect(config.get('mongodb.connectionString'));

  app.use(router.routes())
  .use(router.allowedMethods());

  return new Promise((resolve) => {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'mongodb connection error:'));
    db.once('open', () => {
      return resolve(app);
    });
  });
};
