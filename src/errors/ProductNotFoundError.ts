/**
 * Custom error for when someone requests a product which doesn't exist
 */
export class ProductNotFoundError extends Error {
  public type: string = 'ProductNotFoundError';

  constructor(asin: string) {
    super(`Failed too find the product with ASIN "${asin}"`);
  }
}
