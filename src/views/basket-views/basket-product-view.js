import AbstractStatefulView from '../../framework/view/abstract-stateful-view';
import { beautifyPrice } from '../../utils/general';

const createBasketProductTemplate = (productData, productQuantity) => (`
  <li class="popup-deferred__item">
    <div class="deferred-card ${productData.isDeleting ? 'is-loading' : ''}">
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

export default class BasketProductView extends AbstractStatefulView {
  #productQuantity = null;

  constructor(productData, productQuantity) {
    super();
    this._state = productData;
    this.#productQuantity = productQuantity;
  }

  _restoreHandlers = () => {
    this.setDeleteProductButtonClickHandler(this._callback.deleteProductButtonClick);
    this.setIncreaseQuantityButtonClickHandler(this._callback.increaseQuantityButtonClick);
    this.setDecreaseQuantityButtonClickHandler(this._callback.decreaseQuantityButtonClick);
  };

  setDeleteProductButtonClickHandler = (callback) => {
    this._callback.deleteProductButtonClick = callback;

    this.element.querySelector('.deferred-card__close-btn').addEventListener('click', this.#deleteProductButtonClickHandler);
  };

  #deleteProductButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteProductButtonClick(evt.currentTarget.dataset.productId);
  };

  setIncreaseQuantityButtonClickHandler = (callback) => {
    this._callback.increaseQuantityButtonClick = callback;

    this.element.querySelector('.btn-calculate--increase').addEventListener('click', this.#increaseQuantityButtonClickHandler);
  };

  #increaseQuantityButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.increaseQuantityButtonClick(evt.currentTarget.dataset.productId);
  };

  setDecreaseQuantityButtonClickHandler = (callback) => {
    this._callback.decreaseQuantityButtonClick = callback;

    this.element.querySelector('.btn-calculate--decrease').addEventListener('click', this.#decreaseQuantityButtonClickHandler);
  };

  #decreaseQuantityButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.decreaseQuantityButtonClick(evt.currentTarget.dataset.productId);
  };

  get template() {
    return createBasketProductTemplate(this._state, this.#productQuantity);
  }
}
