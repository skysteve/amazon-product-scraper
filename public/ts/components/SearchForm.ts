import { IProduct } from '../../../src/interfaces/Product';
import { OutputPanel } from './OutputPanel';
import { NotificationBar, NotificationLevel } from './NotificationBar';

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
      this.loadProduct();
    } catch (error) {
      const event = new CustomEvent('error', { detail: { error } });
      this.dispatchEvent(event);
    }

    return false;
  }

  private async loadProduct() {
    const elOutputPanel = document.getElementById('output-panel') as OutputPanel;
    const notificationBar = document.getElementById('notification-bar') as NotificationBar;

    const elAsin = document.getElementById('asin') as HTMLInputElement;
    const elForceRefresh = document.getElementById('force-refresh') as HTMLInputElement;

    const asin = elAsin.value.trim();
    const bRefresh = elForceRefresh.checked;

    notificationBar.hide();
    // show loading state
    elOutputPanel.loading = true;

    const res = await fetch(`/product/${asin}?refresh=${bRefresh}`);

    // if we get a product back - render it
    if (res.status === 200) {
      elOutputPanel.product = await res.json() as IProduct;
      return;
    }

    notificationBar.show(`Failed to load product: ${res.status} ${res.statusText}`, NotificationLevel.danger);
    elOutputPanel.loading = false;
  }
}
