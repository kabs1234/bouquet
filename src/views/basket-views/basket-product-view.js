import AbstractView from '../../framework/view/abstract-view';
import { beautifyPrice } from '../../utils/general';

const createBasketProductTemplate = (productData, productQuantity) => (`
  <li class="popup-deferred__item">
    <div class="deferred-card">
      <div class="deferred-card__img">
        <picture>
          <img src="${productData.previewImage}" width="233" height="393" alt="букет">
        </picture>
      </div>
      <div class="deferred-card__content">
        <h2 class="title title--h2">${productData.title}</h2>
        <p class="text text--size-40">${productData.description}</p>
      </div>
      <div class="deferred-card__count">
        <button class="btn-calculate btn-calculate--decrease" type="button" data-product-id=${productData.id}>
          <svg width="30" height="27" aria-hidden="true">
            <use xlink:href="#icon-minus"></use>
          </svg>
        </button>
        <span>${productQuantity}</span>
        <button class="btn-calculate btn-calculate--increase" type="button" data-product-id=${productData.id}>
          <svg width="30" height="28" aria-hidden="true">
            <use xlink:href="#icon-cross"></use>
          </svg>
        </button>
      </div>
      <div class="deferred-card__price">
      <b class="price price--size-middle-p">
        ${beautifyPrice(productData.price)}<span>Р</span>
      </b>
      </div>
      <button class="btn-close deferred-card__close-btn" type="button" data-product-id=${productData.id}>
        <svg width="55" height="56" aria-hidden="true">
          <use xlink:href="#icon-close-big"></use>
        </svg>
      </button>
      <svg class="deferred-card__close-btn deferred-card__loader" width="56" height="56" aria-hidden="true">
        <use xlink:href="#icon-loader"></use>
      </svg>
    </div>
  </li>
`);

export default class BasketProductView extends AbstractView {
  #productData = null;
  #productQuantity = null;

  constructor(productData, productQuantity) {
    super();
    this.#productData = productData;
    this.#productQuantity = productQuantity;
  }

  setDeleteProductButtonClickHandler = (callback) => {
    this._callback.deleteProductButtonClick = callback;
    const allProductCloseButtons = this.element.querySelectorAll('.deferred-card__close-btn');

    allProductCloseButtons.forEach((productCloseButton) =>
      productCloseButton.addEventListener('click', this.#deleteProductButtonClickHandler));
  };

  #deleteProductButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteProductButtonClick(evt.currentTarget.dataset.productId);
  };

  setIncreaseQuantityButtonClickHandler = (callback) => {
    this._callback.increaseQuantityButtonClick = callback;

    const allIncreaseQuantityButtons = this.element.querySelectorAll('.btn-calculate--increase');

    allIncreaseQuantityButtons.forEach((increaseButton) =>
      increaseButton.addEventListener('click', this.#increaseQuantityButtonClickHandler));
  };

  #increaseQuantityButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.increaseQuantityButtonClick(evt.currentTarget.dataset.productId);
  };

  setDecreaseQuantityButtonClickHandler = (callback) => {
    this._callback.decreaseQuantityButtonClick = callback;

    const allDecreaseQuantityButtons = this.element.querySelectorAll('.btn-calculate--decrease');

    allDecreaseQuantityButtons.forEach((decreaseButton) =>
      decreaseButton.addEventListener('click', this.#decreaseQuantityButtonClickHandler));
  };

  #decreaseQuantityButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.decreaseQuantityButtonClick(evt.currentTarget.dataset.productId);
  };

  get template() {
    return createBasketProductTemplate(this.#productData, this.#productQuantity);
  }
}
