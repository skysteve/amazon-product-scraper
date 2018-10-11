import { ProductTable } from './components/ProductTable';
import { NotificationBar, NotificationLevel } from './components/NotificationBar';
import { OutputPanel } from './components/OutputPanel';
import { SearchForm, SearchEvents } from './components/SearchForm';

try {
  // define our components
  customElements.define('product-table', ProductTable, { extends: 'table' });
  customElements.define('notification-bar', NotificationBar);
  customElements.define('output-panel', OutputPanel);
  customElements.define('search-form', SearchForm);

  const elOutputPanel = document.getElementById('output-panel') as OutputPanel;
  const elNotificationBar = document.getElementById('notification-bar') as NotificationBar;
  const elSearchForm = document.getElementById('search-form') as NotificationBar;

  // when loading - hide any active notifications, and show the loading spinner
  elSearchForm.addEventListener(SearchEvents.loadingProduct, (event: CustomEvent) => {
    elNotificationBar.hide();
    // show loading state
    elOutputPanel.loading = true;
  });

  // when a product is loaded - show it
  elSearchForm.addEventListener(SearchEvents.productLoaded, (event: CustomEvent) => {
    elOutputPanel.product = event.detail.product;
  });

  // when there's an error, reset the loading screen, and show the error dialog
  elSearchForm.addEventListener(SearchEvents.error, (event: CustomEvent) => {
    elOutputPanel.loading = false;
    elNotificationBar.show(event.detail.error, NotificationLevel.danger);
  });

} catch (ex) {
  document.body.innerHTML = '<h1>Your browser is not supported, please use a modern browser such as Google Chrome</h1>';
}
