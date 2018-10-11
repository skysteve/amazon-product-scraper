import {IProduct} from '../../interfaces/Product';
import {IProductPageHelper} from '../../interfaces/ProductPageHelper';
import { Page } from 'puppeteer';

// e.g. https://www.amazon.com/dp/B07DN5YN3Y

const selectors = {
  category: '#wayfinding-breadcrumbs_feature_div ul',
  productDetails: '#productDetails_detailBullets_sections1 tr', // this has rank and dimensions in
  title: '#productTitle'
};

function pageScrapeData(selectorList: any): IProduct {
  const result: any = {};

  const elTitle = document.querySelector(selectorList.title);
  const elCategory = document.querySelector(selectorList.category);
  const elProductDetails = document.querySelectorAll(selectorList.productDetails);

  // this shouldn't happen, but just incase, check all our elements exist
  if (!elTitle || !elCategory || !elProductDetails|| elProductDetails.length < 1) {
    throw new Error(`Could not find selector for ${selectorList.title}`);
  }

  // get all the data from the page
  result.title = elTitle.textContent.trim();
  // clean up all the extra whitespace
  result.category = elCategory.textContent.replace(/\n/g, '').replace(/\s+/g, ' ').trim();

  let dimensions;
  let rank;
  // try to find the row with the product dimensions
  elProductDetails.forEach((rowItem) => {
    const cellValue = rowItem.querySelector('td');
    const cellTitle = rowItem.querySelector('th');

    // this should never happen, but check we have a title cell
    if (!cellTitle) {
      return;
    }

    const title = cellTitle.textContent.trim();

    if (title === 'Package Dimensions') {
      dimensions = cellValue.textContent;
    } else if (title === 'Best Sellers Rank') {
      rank = cellValue.textContent;
    }
  });

  // save the dimensions - or unknown if we didn't find any
  if (dimensions) {
    result.dimensions = dimensions.trim();
  }

  if (rank) {
    result.rank = rank;
  }

  return result;
}

class PageStyleTwo implements IProductPageHelper {

  public async testPage(page: Page, timeout: number): Promise<IProductPageHelper> {
    // wait for the selectors to appear on the page
    await Promise.all(Object.values(selectors).map((selector) => {
      return page.waitForSelector(selector, {
        timeout: timeout
      });
    }));

    return this;
  }

  public scrapeData(page: Page): Promise<IProduct> {
    return page.evaluate(pageScrapeData, selectors);
  }
}


export default new PageStyleTwo();
