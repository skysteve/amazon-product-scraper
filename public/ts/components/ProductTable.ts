import { IProduct } from '../../../src/interfaces/Product';

export class ProductTable extends HTMLTableElement {
  private product: IProduct;

  constructor(product: IProduct) {
    super();
    this.classList.add('table', 'is-striped');
    this.product = product;
  }

  public connectedCallback() {
    this.innerHTML = `
    <tr>
      <th>ASIN</th>
      <td>${this.product.id}</td>
    </tr>
    <tr>
      <th>Title</th>
      <td>${this.product.title}</td>
    </tr>
    <tr>
      <th>Category</th>
      <td>${this.product.category || 'Unknown'}</td>
    </tr>
    <tr>
      <th>Dimensions</th>
      <td>${this.product.dimensions || 'Unknown'}</td>
    </tr>
    <tr>
      <th>Rank</th>
      <td>${this.product.rank ? this.product.rank.join('<br>') : 'Unknown'}</td>
    </tr>
    <tr>
      <th>Last Updated</th>
      <td>${this.product.lastUpdated}</td>
    </tr>
    <tr>
      <th>Status</th>
      <td>${this.product.deleted ? 'This product has been deleted' : 'Active'}</td>
    </tr>`;
  }
}
