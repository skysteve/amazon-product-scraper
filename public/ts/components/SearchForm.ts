import { IProduct } from '../../../src/interfaces/Product';

export class SearchForm extends HTMLElement {
  constructor() {
    super();
  }

  public connectedCallback() {
    const hashValue = location.hash.substring(1); // skip the #
    this.innerHTML = `<div class="field">
    <label class="label">ASIN</label>
    <div class="control">
      <input id="asin" class="input" type="text" placeholder="e.g. B002QYW8LW" value="${hashValue}">
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
      const elAsin = document.getElementById('asin') as HTMLInputElement;
      // const elForceRefresh = document.getElementById('force-refresh') as HTMLInputElement;

      location.hash = elAsin.value.trim();
    } catch (error) {
      const event = new CustomEvent('error', { detail: { error } });
      this.dispatchEvent(event);
    }

    return false;
  }
}
