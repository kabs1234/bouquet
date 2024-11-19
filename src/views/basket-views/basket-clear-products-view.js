import AbstractStatefulView from '../../framework/view/abstract-stateful-view';

const createBasketClearProductsButtonTemplate = ({isClearing}) => (`
    <div class="popup-deferred__btn-container">
      <button class="btn btn--with-icon popup-deferred__btn-clean" type="button">${isClearing ? 'Очищаем...' : 'очистить'}
        <svg width="61" height="24" aria-hidden="true">
          <use xlink:href="#icon-arrow"></use>
        </svg>
      </button>
    </div>
  `);

export default class BasketClearProductsButtonView extends AbstractStatefulView {
  constructor(options) {
    super();
    this._state = options;
  }

  get template() {
    return createBasketClearProductsButtonTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.setBasketClearButtonClickHandler(this._callback.basketClearButtonClick);
  };

  setBasketClearButtonClickHandler = (callback) => {
    this._callback.basketClearButtonClick = callback;
    this.element.querySelector('.popup-deferred__btn-clean').addEventListener('click', this.#basketClearButtonClickHandler);
  };

  #basketClearButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.basketClearButtonClick();
  };
}
