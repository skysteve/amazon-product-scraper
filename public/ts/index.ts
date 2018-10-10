import { ProductTable } from './components/ProductTable';
import { NotificationBar, NotificationLevel } from './components/NotificationBar';
import { OutputPanel } from './components/OutputPanel';
import { SearchForm } from './components/SearchForm';

async function loadProduct() {
  const elOutputPanel = document.getElementById('output-panel') as OutputPanel;
  const notificationBar = document.getElementById('notification-bar') as NotificationBar;

  // if there's no hash - do nothing
  if (!location.hash) {
    elOutputPanel.loading = false;
    return;
  }
  const asin = location.hash.substring(1); // skip the #
  const bRefresh = false; // TODO

  notificationBar.hide();
  // show loading state
  elOutputPanel.loading = true;

  const res = await fetch(`/product/${asin}?refresh=${bRefresh}`);

  // if we get a product back - render it
  if (res.status === 200) {
    elOutputPanel.product = await res.json();
    return;
  }

  notificationBar.show(`Failed to load product: ${res.status} ${res.statusText}`, NotificationLevel.danger);
  elOutputPanel.loading = false;
}

function init() {
  window.addEventListener('hashchange', loadProduct);
  loadProduct(); // do the initial load (if we have a hash)
}

customElements.define('search-form', SearchForm);
customElements.define('product-table', ProductTable, { extends: 'table' });
customElements.define('notification-bar', NotificationBar);
customElements.define('output-panel', OutputPanel);

if (document.readyState === 'interactive') {
  init();
} else {
  document.onreadystatechange = () => {
    if (document.readyState === 'interactive') {
      init();
    }
  };
}
