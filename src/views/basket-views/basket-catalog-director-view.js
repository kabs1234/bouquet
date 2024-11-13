import AbstractView from '../../framework/view/abstract-view';

const createBasketCatalogDirectorTemplate = () => (`
  <a class="btn btn--with-icon popup-deferred__btn btn--light" href="#">в&nbsp;каталог
    <svg width="61" height="24" aria-hidden="true">
      <use xlink:href="#icon-arrow"></use>
    </svg>
  </a>
`);

export default class BasketCatalogDirectorView extends AbstractView {
  get template() {
    return createBasketCatalogDirectorTemplate();
  }

  setDirectToCatalogButtonClickHandler = (callback) => {
    this._callback.directToCatalogButtonClick = callback;
    this.element.addEventListener('click', this.#directToCatalogButtonClickHandler);
  };

  #directToCatalogButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.directToCatalogButtonClick();
  };
}
