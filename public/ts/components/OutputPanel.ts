import { IProduct } from "../../../src/interfaces/Product";
import { ProductTable } from "./ProductTable";

export class OutputPanel extends HTMLElement {
  constructor() {
    super();
    this.classList.add('column');
  }

  public set product(product: IProduct) {
    const productView = new ProductTable(product);

    this.loading = false; // reset loading state, we have a product - we're good
    this.appendChild(productView);
  }

  public set loading(bLoading: boolean) {
    if (bLoading) {
      this.innerHTML = '<h1>Loading please wait</h1><br><i class="fas fa-spinner fa-spin"></i>';
    } else {
      this.innerHTML = '';
    }
  }
}
