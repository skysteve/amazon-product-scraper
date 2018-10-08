import * as Router from 'koa-router';
import { scrapeProductData } from '../puppeteer_scripts/scrapeProductData';
import Product from '../models/Product';

// TODO - put the data into a DB + try to get from the DB first

export const handler: Router.IMiddleware = async (ctx) => {
  const asin = ctx.params.asin;

  // this shouldn't happen - koa should do it for us, but to be safe
  if (!asin) {
    throw new Error('ASIN must be supplied');
  }

  const dbProduct = await Product.findById(asin);

  // if we found the product in the DB - return it back - no need to scrape it
  // TODO - this doesn't allow us to refresh from the site
  if (dbProduct) {
    return ctx.body = dbProduct.toJSON();
  }

  // scrape the product - and return the json
  return scrapeProductData(asin)
  .then((productData) => {
    ctx.body = productData
    // save the product in the DB
    const product = new Product(productData);
    return product.save();
  })
  .catch((ex) => {
    console.error(ex);
    ctx.status = 500;
    ctx.body = {
      error: ex.message
    };
  });
};
