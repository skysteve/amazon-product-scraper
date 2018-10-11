import { Page } from 'puppeteer';
import {IProduct} from './Product';

export interface IProductPageHelper {
  scrapeData(page: Page): Promise<IProduct>;
  testPage(page: Page, timeout: number): Promise<IProductPageHelper>;
}
