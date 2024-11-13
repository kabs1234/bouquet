import AbstractView from '../../framework/view/abstract-view';

const createBasketClearProductsButtonTemplate = () => (`
  <div class="popup-deferred__btn-container">
    <button class="btn btn--with-icon popup-deferred__btn-clean" type="button">очистить
      <svg width="61" height="24" aria-hidden="true">
        <use xlink:href="#icon-arrow"></use>
      </svg>
    </button>
  </div>
`);

export default class BasketClearProductsButtonView extends AbstractView {
  get template() {
    return createBasketClearProductsButtonTemplate();
  }

  setBasketClearButtonClickHandler = (callback) => {
    this._callback.basketClearButtonClick = callback;
    this.element.querySelector('.popup-deferred__btn-clean').addEventListener('click', this.#basketClearButtonClickHandler);
  };

  #basketClearButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.basketClearButtonClick();
  };
}
