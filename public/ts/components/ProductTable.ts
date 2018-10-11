import { IProduct } from "../../../src/interfaces/Product";

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
      <td>${this.product.category}</td>
    </tr>
    <tr>
      <th>Dimensions</th>
      <td>${this.product.dimensions}</td>
    </tr>
    <tr>
      <th>Rank</th>
      <td>${this.product.rank ? this.product.rank.join('<br>') : ''}</td>
    </tr>
    <tr>
      <th>Status</th>
      <td>${this.product.deleted ? 'This product has been deleted' : 'Active'}</td>
    </tr>`;
  }
}
