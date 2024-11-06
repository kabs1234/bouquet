import AbstractView from "../framework/view/abstract-view.js";

const createBasketButtonTemplate = ({sum, productCount}) => (`
  <div class="header__container">
    <div class="header-count">
      <button class="header-count__btn" type="button">
        <svg width="60" height="47" aria-hidden="true">
          <use xlink:href="#icon-heart-header"></use>
        </svg>
        <span class="visually-hidden">закрыть</span>
      </button>
      <div class="header-count__count">
        <p class="text text--size-20 header-count__counter">${productCount}</p>
      </div>
      <div class="header-count__block">
        <p class="text text--size-20 header-count__text">сумма</p>
        <b class="price price--size-min header-count__price">
          ${sum}
          <span>Р</span>
        </b>
      </div>
    </div>
  </div>
`)

export default class BasketButtonView extends AbstractView {
  #basketData = null;

  constructor(basketData) {
    super();
    this.#basketData = basketData;
  }

  get template() {
    return createBasketButtonTemplate(this.#basketData);
  }
}
