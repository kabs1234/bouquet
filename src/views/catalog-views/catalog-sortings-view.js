import { SortByPrice } from '../../constants.js';
import AbstractView from '../../framework/view/abstract-view.js';

const createCatalogSortingsTemplate = (activeSorting) => (`
  <div class="catalogue__header">
    <h2 class="title title--h3 catalogue__title">Каталог</h2>
    <div class="catalogue__sorting">
      <div class="sorting-price">
        <h3 class="title sorting-price__title">Цена</h3>
        <a class="sorting-price__link sorting-price__link--incr ${activeSorting === SortByPrice.Increase ? 'sorting-price__link--active' : ''}" aria-label="сортировка по возрастанию цены">
          <svg class="sorting-price__icon" width="50" height="46" aria-hidden="true">
            <use xlink:href="#icon-increase-sort"></use>
          </svg></a>
        <a class="sorting-price__link sorting-price__link--decr ${activeSorting === SortByPrice.Decrease ? 'sorting-price__link--active' : ''}" aria-label="сортировка по убыванию цены">
          <svg class="sorting-price__icon" width="50" height="46" aria-hidden="true">
            <use xlink:href="#icon-descending-sort"></use>
          </svg>
        </a>
      </div>
    </div>
`);

export default class CatalogSortingsView extends AbstractView {
  #activeSorting = null;

  constructor(activeSorting) {
    super();
    this.#activeSorting = activeSorting;
  }

  get template() {
    return createCatalogSortingsTemplate(this.#activeSorting);
  }

  setIncreaseButtonClickHandler = (callback) => {
    this._callback.increaseButtonClick = callback;
    this.element.querySelector('.sorting-price__link--incr').addEventListener('click', this.#increaseButtonClickHandler);
  };

  #increaseButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.increaseButtonClick();
  };

  setDecreaseButtonClickHandler = (callback) => {
    this._callback.decreaseButtonClick = callback;
    this.element.querySelector('.sorting-price__link--decr').addEventListener('click', this.#decreaseButtonClickHandler);
  };

  #decreaseButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.decreaseButtonClick();
  };
}
