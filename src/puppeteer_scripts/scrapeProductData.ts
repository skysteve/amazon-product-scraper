import puppeteer from 'puppeteer';

import {ProductNotFoundError} from '../errors/ProductNotFoundError';
import pageStyleOne from './product_scrapers/pageStyleOne';
import { IProductPageHelper } from '../interfaces/ProductPageHelper';

const WAIT_TIMEOUT = 5000; // 5 seconds

export async function scrapeProductData(asin: string) {
  const browser = await puppeteer.launch({});

  const page = await browser.newPage();
  const response = await page.goto(`https://www.amazon.com/dp/${asin}`);

  // this shouldn't happen, but just incase
  if (!response) {
    throw new ProductNotFoundError(asin);
  }

  // if amazon sends us a 404 - the ASIN isn't valid
  if (response.status() === 404) {
    throw new ProductNotFoundError(asin);
  }

  // wait for the page to load fully
  await page.waitForFunction('document.readyState === "interactive" || document.readyState === "complete"', { timeout : WAIT_TIMEOUT});

  let pageHandler: IProductPageHelper | void;
  try {
    // there are a few styles of product page - try to find a helper for this type of page
    pageHandler = await Promise.race([
      pageStyleOne.testPage(page, WAIT_TIMEOUT)
    ]);
  } catch (ex) {
    // if we timed out waiting for selectors, we don't need to throw that error, we make our own belo
    // anything else, we want to throw the error up the stack
    if (ex.name !== 'TimeoutError') {
      throw ex;
    }
  }

  if (!pageHandler) {
    throw new Error('Failed to understand this type of product page');
  }

  // get the data from the page
  const jsonData = await pageHandler.scrapeData(page);
  jsonData.id = asin;

  // close the page, and return the result
  await browser.close();
  return jsonData;
}
