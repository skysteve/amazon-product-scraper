import puppeteer, { Browser } from 'puppeteer';

import {ProductNotFoundError} from '../errors/ProductNotFoundError';
import pageStyleOne from './product_scrapers/pageStyleOne';
import pageStyleTwo from './product_scrapers/pageStyleTwo';
import { IProductPageHelper } from '../interfaces/ProductPageHelper';

const WAIT_TIMEOUT = 5000; // 5 seconds
let browser: Browser;

function formatRanks(rawString?: string): string[] | undefined {
  const resultsArray: string[] = [];

  if (!rawString) {
    return;
  }

  const ranksArray = rawString.split('\n')
  .map((item) => item.trim()) // take out any excess whitespace
  .filter((item) => !!item);

  const regexMatch = /^#\d+$/;

  for (let i = 0; i < ranksArray.length; i++) {
    const current = ranksArray[i];
    if (!regexMatch.test(current)) {
      resultsArray.push(current);
    } else {
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

export async function scrapeProductData(asin: string) {
  if (!browser) {
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox'
      ]
    });
  }
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
