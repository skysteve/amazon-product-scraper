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
      <td>ASIN</td>
      <td>${this.product.id}</td>
    </tr>
    <tr>
      <td>Title</td>
      <td>${this.product.title}</td>
    </tr>
    <tr>
      <td>Category</td>
      <td>${this.product.category}</td>
    </tr>
    <tr>
      <td>Dimensions</td>
      <td>${this.product.dimensions}</td>
    </tr>
    <tr>
      <td>Rank</td>
      <td>${this.product.rank}</td>
    </tr>
    <tr>
      <td>Status</td>
      <td>${this.product.deleted ? 'This product has been deleted' : 'Active'}</td>
    </tr>`;
  }
}
