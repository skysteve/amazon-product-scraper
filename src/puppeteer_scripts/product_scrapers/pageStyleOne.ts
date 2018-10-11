import {IProduct} from '../../interfaces/Product';
import {IProductPageHelper} from '../../interfaces/ProductPageHelper';
import { Page } from 'puppeteer';

const selectors = {
  category: '#wayfinding-breadcrumbs_feature_div ul',
  dimensions: '.size-weight', // note - we want the 2nd of these
  title: '#productTitle',
  rank: '#SalesRank .value'
};

function pageScrapeData(selectorList: any): IProduct {
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

class PageStyleOne implements IProductPageHelper {

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


export default new PageStyleOne();
