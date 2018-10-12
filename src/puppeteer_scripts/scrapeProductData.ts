import puppeteer, { Browser } from 'puppeteer';

import {ProductNotFoundError} from '../errors/ProductNotFoundError';
import pageStyleOne from './product_scrapers/pageStyleOne';
import pageStyleTwo from './product_scrapers/pageStyleTwo';
import { IProductPageHelper } from '../interfaces/ProductPageHelper';

const WAIT_TIMEOUT = 5000; // 5 seconds
let browser: Browser;

/**
 * Helper method to reformat ranks from a string as it's scraped off the page
 * into an array of ranks for each category the product is associated with
 * @param rawString {string} the raw string scraped from the site
 * @returns {string[]} an array of ranks
 */
function formatRanks(rawString?: string): string[] | undefined {
  const resultsArray: string[] = [];

  if (!rawString) {
    return;
  }

  // cleanup the raw input by removing excess whitespace
  const ranksArray = rawString.split('\n')
  .map((item) => item.trim()) // take out any excess whitespace
  .filter((item) => !!item);

  const regexMatch = /^#\d+$/;

  // sometimes the rank can appear in a different array item to
  // the category, so try to match things up
  for (let i = 0; i < ranksArray.length; i++) {
    const current = ranksArray[i];
    // if the rank and category are in the same line, just push that straight into the result set
    if (!regexMatch.test(current)) {
      resultsArray.push(current);
    } else {
      // otherwise, assume the rank is this item, and the category is the next item in the array
      // so merge them together
      const next = ranksArray[i + 1];
      if (!next) {
        break;
      }
      resultsArray.push(`${current} ${next}`);
      i++; // skip the next item in the array - we already have it
    }
  }

  // remove anything like "(See top 100)"
  return resultsArray.map((item) => item.replace(/\(see top \d{1,3}\)/i, '').trim());
}

/**
 * Scrape the product data from the page using puppeteer
 * @param asin {string} the product ASIN to scrape data for
 */
export async function scrapeProductData(asin: string) {
  // don't re-create a browser if we already have one, just saves on load time
  if (!browser) {
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox'
      ]
    });
  }

  // nav to the page
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
      pageStyleOne.testPage(page, WAIT_TIMEOUT),
      pageStyleTwo.testPage(page, WAIT_TIMEOUT)
    ]);
  } catch (ex) {
    // if we timed out waiting for selectors, we don't need to throw that error, we make our own belo
    // anything else, we want to throw the error up the stack
    if (ex.name !== 'TimeoutError') {
      throw ex;
    }
  }

  // if we didn't find a helper for this type of page - throw an error
  // in reality we would want to alert someone about this so we can go and add a scraper for it
  if (!pageHandler) {
    throw new Error('Failed to understand this type of product page');
  }

  // get the data from the page
  const jsonData = await pageHandler.scrapeData(page);
  jsonData.rank = formatRanks(jsonData.rank as any);
  jsonData.id = asin;
  jsonData.lastUpdated = new Date(); // set the last updated date

  // close the page, and return the result
  await page.close();
  return jsonData;
}
