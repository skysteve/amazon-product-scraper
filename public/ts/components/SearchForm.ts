import { IProduct } from '../../../src/interfaces/Product';

export enum SearchEvents {
  error = 'error',
  loadingProduct = 'loadingProduct',
  productLoaded = 'productLoaded'
}

export class SearchForm extends HTMLElement {
  constructor() {
    super();
  }

  public connectedCallback() {
    this.innerHTML = `<div class="field">
    <label class="label" for="asin">ASIN</label>
    <div class="control">
      <input id="asin" name="asin" class="input" type="text" placeholder="e.g. B002QYW8LW"/>
    </div>
    <p class="help">Enter the ASIN for a product</p>
  </div>
  <label class="checkbox">
    <input type="checkbox" id="force-refresh">
    Refresh from Amazon
  </label>
  <br>
  <div class="control">
    <button class="button is-primary">Submit</button>
  </div>`;

    const elButton = this.querySelector('.button') as HTMLButtonElement;
    elButton.addEventListener('click', this.onSubmit.bind(this));
  }

  private async onSubmit(event: Event): Promise<boolean> {
    event.preventDefault();

    try {
      await this.loadProduct();
    } catch (error) {
      const errorEvent = new CustomEvent(SearchEvents.error, { detail: { error } });
      this.dispatchEvent(errorEvent);
    }

    return false;
  }

  private async loadProduct() {
    const elAsin = document.getElementById('asin') as HTMLInputElement;
    const elForceRefresh = document.getElementById('force-refresh') as HTMLInputElement;
    const elSubmitButton = this.querySelector('.button') as HTMLButtonElement;

    const asin = elAsin.value.trim();
    const bRefresh = elForceRefresh.checked;

    const loadingEvent = new CustomEvent(SearchEvents.loadingProduct, { detail: { asin, refresh: bRefresh } });
    this.dispatchEvent(loadingEvent);

    // stop multiple submissions
    elSubmitButton.setAttribute('disabled', 'disabled');

    const res = await fetch(`/product/${asin}?refresh=${bRefresh}`);

    // if we get a product back - render it
    if (res.status === 200) {
      const product = await res.json() as IProduct;
      const loadedEvent = new CustomEvent(SearchEvents.productLoaded, { detail: { product } });
      this.dispatchEvent(loadedEvent);
      // allow the button to be clicked again
      elSubmitButton.removeAttribute('disabled');
      return;
    }

    // allow the button to be clicked again, and throw an error that we failed to load
    elSubmitButton.removeAttribute('disabled');
    throw new Error(`Failed to load product: ${res.status} ${res.statusText}`);
  }
}
