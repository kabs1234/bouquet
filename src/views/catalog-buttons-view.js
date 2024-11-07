import AbstractView from '../framework/view/abstract-view.js';

const createCatalogButtonsTemplate = () => (`
  <div class="catalogue__btn-wrap">
    <button class="btn btn--outlined catalogue__show-more-btn" type="button">больше букетов</button>
    <button class="btn-round btn-round--to-top btn-round--size-small catalogue__to-top-btn" type="button" aria-label="наверх">
      <svg width="80" height="85" aria-hidden="true" focusable="false">
        <use xlink:href="#icon-round-button"></use>
      </svg>
    </button>
  </div>
`);

export default class CatalogButtonsView extends AbstractView {
  get template() {
    return createCatalogButtonsTemplate();
  }

  setShowMoreButtonClickHandler = (callback) => {
    this._callback.showMoreButtonClick = callback;
    this.element.querySelector('.catalogue__show-more-btn').addEventListener('click', this.#showMoreButtonClickHandler);
  };

  #showMoreButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.showMoreButtonClick();
  };

  removeShowMoreButton = () => {
    this.element.querySelector('.catalogue__show-more-btn').remove();
  };
}
