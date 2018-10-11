import {IProduct} from '../../interfaces/Product';
import {IProductPageHelper} from '../../interfaces/ProductPageHelper';
import { Page } from 'puppeteer';

// e.g. https://www.amazon.com/dp/B002QYW8LW?th=1

const selectors = {
  category: '#wayfinding-breadcrumbs_feature_div ul',
  dimensions: '.size-weight', // note - we want the 2nd of these
  title: '#productTitle',
  rank: '#SalesRank .value'
};

function pageScrapeData(selectorList: any): IProduct {
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
  result.rank = elRank.textContent;

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
  }

  return result;
}

class PageStyleOne implements IProductPageHelper {

  public async testPage(page: Page, timeout: number): Promise<IProductPageHelper> {
    // wait for the selectors to appear on the page
    await Promise.all(Object.values(selectors).map((selector) => {
      return page.waitForSelector(selector, {
        timeout
      });
    }));

    return this;
  }

  public scrapeData(page: Page): Promise<IProduct> {
    return page.evaluate(pageScrapeData, selectors);
  }
}

export default new PageStyleOne();
