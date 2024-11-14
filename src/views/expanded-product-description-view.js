import AbstractView from '../framework/view/abstract-view.js';
import { beautifyPrice } from '../utils/general.js';

const createExpandedProductDescriptionTemplate = (productData) => (`
  <div class="product-description">
    <div class="product-description__header">
      <h3 class="title title--h2">${productData.title}</h3>
      <b class="price price--size-big">${beautifyPrice(productData.price)}<span>Р</span></b>
    </div>
    <p class="text text--size-40">${productData.description}</p>
    <button class="btn btn--outlined btn--full-width product-description__button" type="button" data-focus="" ${productData.id}>отложить
    </button>
  </div>
`);

export default class ExpandedProductDescriptionView extends AbstractView {
  #productData = null;

  constructor(productData) {
    super();
    this.#productData = productData;
  }

  get template() {
    return createExpandedProductDescriptionTemplate(this.#productData);
  }
}
