import puppeteer from 'puppeteer';

import {ProductNotFoundError} from '../errors/ProductNotFoundError';
import {IProduct} from '../interfaces/Product';

// TODO - these selectors are not universal - e.g. ASIN B07G53N6M8
const selectors = {
  category: '#wayfinding-breadcrumbs_feature_div ul',
  dimensions: '.size-weight', // note - we want the 2nd of these
  title: '#productTitle',
  rank: '#SalesRank .value'
}
const WAIT_TIMEOUT = 5; // seconds



// TODO - not any
function scrapeData(selectorList: any): IProduct {
  function formatRanks(rawString: string): string[] { // TODO - this is horrible
    const resultsArray: string[] = [];
    const ranksArray = rawString.split('\n')
    .map((item) => item.trim()) // take out any excess whitespace
    .filter((item) => !!item);

    const regexMatch = /^#\d+$/;

    for (let i = 0; i < ranksArray.length; i++) {
      const current = ranksArray[i];
      if (!regexMatch.test(current)) {
        resultsArray.push(current);
      } else {
        const next = ranksArray[i+1];
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

  const result: any = {};

  const elTitle = document.querySelector(selectorList.title);
  const elCategory = document.querySelector(selectorList.category);
  const elRank = document.querySelector(selectorList.rank);
  const elDimensions = document.querySelectorAll(selectorList.dimensions);

  // this shouldn't happen, but just incase, check all our elements exist
  if (!elTitle || !elCategory || !elRank || !elDimensions || elDimensions.length < 1) {
    throw new Error(`Could not find selector for ${selectorList.title}`);
  }

  // get all the data from the page
  result.title = elTitle.textContent.trim();
  // clean up all the extra whitespace
  result.category = elCategory.textContent.replace(/\n/g, '').replace(/\s+/g, ' ').trim();

  // reformat the ranks into an array for each category
  result.rank = formatRanks(elRank.textContent);

  let dimensions;
  // try to find the row with the product dimensions
  elDimensions.forEach((rowItem) => {
    const cells = rowItem.querySelectorAll('td');
    if (cells[0] && cells[0].textContent === 'Product Dimensions') {
      dimensions = cells[1].textContent;
    }
  });

  // save the dimensions - or unknown if we didn't find any
  if (dimensions) {
    result.dimensions = dimensions.trim();
  } else {
    result.dimensions = 'Unknown';
  }

  return result;
}


export async function scrapeProductData(asin: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const response = await page.goto(`https://www.amazon.com/dp/${asin}`);

  // this shouldn't happen, but just incase
  if (!response) {
    throw new ProductNotFoundError(asin);
  }

  if (response.status() === 404) {
    throw new ProductNotFoundError(asin);
  }

  // wait for the selectors to appear on the page
  await Promise.all(Object.values(selectors).map((selector) => {
    return page.waitForSelector(selector, {
      timeout: WAIT_TIMEOUT * 1000
    });
  }));

  // get the data from the page
  const jsonData = await page.evaluate(scrapeData, selectors);
  jsonData._id = asin;

  // close the page, and return the result
  await browser.close();
  return jsonData;
}
