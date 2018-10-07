import puppeteer from 'puppeteer';

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
  const result: IProduct = {};

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
  result.category = elCategory.textContent.trim(); // TODO - needs tiding up
  result.rank = elRank.textContent.trim(); // TODO - needs tiding up
  result.dimensions = elDimensions[1].textContent.trim(); // TODO - needs tiding up

  return result;
}


export async function scrapeProductData(asin: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.amazon.com/dp/${asin}`);

  // wait for the selectors to appear on the page
  await Promise.all(Object.values(selectors).map((selector) => {
    return page.waitForSelector(selector, {
      timeout: WAIT_TIMEOUT * 1000
    });
  }));

  // get the data from the page
  const jsonData = await page.evaluate(scrapeData, selectors);

  // close the page, and return the result
  await browser.close();
  return jsonData;
}
