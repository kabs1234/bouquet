import AbstractView from '../../framework/view/abstract-view.js';

const createBasketHeroTemplate = (isLoading) => (`
  <section class="hero hero--popup ${isLoading ? 'is-loading' : ''}">
    <div class="hero__wrapper">
      <div class="hero__background">
        <picture>
          <source type="image/webp" srcset="img/content/hero-back-popup.webp, img/content/hero-back-popup@2x.webp 2x"><img src="img/content/hero-back-popup.jpg" srcset="img/content/hero-back-popup@2x.jpg 2x" width="1770" height="601" alt="фоновая картинка">
        </picture>
      </div>
      <div class="hero__content">
        <h2 class="title title--h1">Вас<br>заинтересовали</h2>
        <button class="btn-close btn-close--dark hero__popupclose" type="button" aria-label="Закрыть">
          <svg width="56" height="54" aria-hidden="true">
            <use xlink:href="#icon-union"></use>
          </svg>
        </button>
        <div class="btn-close btn-close--dark hero__loader">
          <svg class="hero__loader-icon" width="56" height="56" aria-hidden="true">
            <use xlink:href="#icon-loader"></use>
          </svg>
        </div>
      </div>
    </div>
  </section>
`);

export default class BasketHeroView extends AbstractView {
  #isLoading = null;

  constructor(isLoading) {
    super();
    this.#isLoading = isLoading;
  }

  get template() {
    return createBasketHeroTemplate(this.#isLoading);
  }

  setBasketCloseButtonClickHandler = (callback) => {
    this._callback.basketCloseButtonClick = callback;
    this.element.querySelector('.hero__popupclose').addEventListener('click', this.#basketCloseButtonClickHandler);
  };

  #basketCloseButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.basketCloseButtonClick();
  };
}
