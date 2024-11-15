import AbstractView from '../framework/view/abstract-view.js';
import { beautifyPrice } from '../utils/general.js';

const createExpandedProductDescriptionTemplate = (productData, basketData) => {
  const productsId = Object.keys(basketData);
  const isFavorite = productsId.includes(productData.id);

  return (`
    <div class="product-description">
      <div class="product-description__header">
        <h3 class="title title--h2">${productData.title}</h3>
        <b class="price price--size-big">${beautifyPrice(productData.price)}<span>Р</span></b>
      </div>
      <p class="text text--size-40">${productData.description}</p>
      <button class="btn btn--outlined btn--full-width product-description__button" type="button" data-focus="">${isFavorite ? 'отложено' : 'отложить'}</button>
    </div>
  `);
};

export default class ExpandedProductDescriptionView extends AbstractView {
  #productData = null;
  #basketData = null;

  constructor(productData, basketData) {
    super();
    this.#productData = productData;
    this.#basketData = basketData;
  }

  setFavoriteButtonClickHandler = (callback) => {
    this._callback.favoriteButtonClick = callback;
    this.element.querySelector('.product-description__button').addEventListener('click', this.#favoriteButtonClickHandler);
  };

  #favoriteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteButtonClick(evt.currentTarget.dataset.productId);
  };

  get template() {
    return createExpandedProductDescriptionTemplate(this.#productData, this.#basketData);
  }
}
