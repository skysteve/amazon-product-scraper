import { ProductTable } from './components/ProductTable';
import { NotificationBar } from './components/NotificationBar';
import { OutputPanel } from './components/OutputPanel';
import { SearchForm } from './components/SearchForm';

try {
  customElements.define('product-table', ProductTable, { extends: 'table' });
  customElements.define('notification-bar', NotificationBar);
  customElements.define('output-panel', OutputPanel);
  customElements.define('search-form', SearchForm);
} catch (ex) {
  document.body.innerHTML = '<h1>Your browser is not supported, please use a modern browser such as Google Chrome</h1>';
}

/* if (document.readyState === 'interactive' || document.readyState === 'complete') {
  this.loadProduct();
} else {
  document.onreadystatechange = () => {
    if (document.readyState === 'interactive') {
      this.loadProduct();
    }
  };
} */
