import * as Router from 'koa-router';
import { scrapeProductData } from '../puppeteer_scripts/scrapeProductData';

// TODO - put the data into a DB + try to get from the DB first

export const handler: Router.IMiddleware = (ctx) => {
  const asin = ctx.params.asin;

  // this shouldn't happen - koa should do it for us, but to be safe
  if (!asin) {
    throw new Error('ASIN must be supplied');
  }

  // scrape the product - and return the json
  return scrapeProductData(asin)
  .then((productData) => {
    ctx.body = productData
  })
  .catch((ex) => {
    console.error(ex);
    ctx.status = 500;
    ctx.body = {
      error: ex.message
    };
  });
};
