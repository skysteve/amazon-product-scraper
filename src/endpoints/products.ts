import * as Router from 'koa-router';
import { scrapeProductData } from '../puppeteer_scripts/scrapeProductData';
import Product from '../models/Product';
import { ProductNotFoundError } from '../errors/ProductNotFoundError';

export const handler: Router.IMiddleware = async (ctx) => {
  let asin = ctx.params.asin;
  const refresh = ctx.query.refresh === 'true';

  // this shouldn't happen - koa should do it for us, but to be safe
  if (!asin) {
    throw new Error('ASIN must be supplied');
  }

  // for consistency - uppercase the ASIN
  asin = asin.toUpperCase();

  const dbProduct = await Product.findById(asin);

  // if we found the product in the DB - return it back - no need to scrape it
  // unless we've been asked explicity to refresh from amazon
  if (dbProduct && !refresh) {
    return ctx.body = (dbProduct as any).toResponse();
  }

  // scrape the product - and return the json
  return scrapeProductData(asin)
  .then(async (productData) => {
    // this should never happen, but just incase
    if (!productData) {
      throw new Error('No product data');
    }

    // if we had an existing product - update it
    if (dbProduct) {
      await dbProduct.update(productData);
      ctx.body = (dbProduct as any).toResponse();
      return;
    }

    // if we had no previous product - create a new one and save it
    const product = new Product(productData);
    await product.save();
    // return back the formatted product
    ctx.body = (product as any).toResponse();
  })
  .catch(async (ex) => {
    // if we got a product not found error - return back a 404
    if (ex instanceof ProductNotFoundError) {
      // if we had a product in the DB - update it that it's been deleted
      if (dbProduct) {
        await dbProduct.update({ deleted: true});
      }
      ctx.status = 404;
      ctx.body = {
        error: ex.message
      };
      return;
    }

    // for any other error - log the error, and send a 500 response
    console.error(ex);
    ctx.status = 500;
    ctx.body = {
      error: ex.message
    };
  });
};
