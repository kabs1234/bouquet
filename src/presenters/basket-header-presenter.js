import { remove, render, replace } from '../framework/render.js';
import BasketHeaderView from '../views/basket-views/basket-header-view.js';

export default class BasketHeaderPresenter {
  #container = null;
  #productsModel = null;
  #basketHeaderView = null;
  #handleBasketButtonClick = null;

  constructor (container, productsModel, basketButtonClickHandler) {
    this.#container = container;
    this.#productsModel = productsModel;
    this.#handleBasketButtonClick = basketButtonClickHandler;

    this.#productsModel.addObserver(this.#renderBasketHeader);
  }

  #renderBasketHeader = () => {
    if (this.#productsModel.basket === null) {
      return;
    }

    const previousBasketHeaderView = this.#basketHeaderView;

    this.#basketHeaderView = new BasketHeaderView(this.#productsModel.basket);
    this.#basketHeaderView.setBasketButtonClickHandler(this.#handleBasketButtonClick);

    if (previousBasketHeaderView === null) {
      render(this.#basketHeaderView, this.#container);
      return;
    }

    replace(this.#basketHeaderView, previousBasketHeaderView);
    remove(previousBasketHeaderView);
  };

  initalize = () => {
    this.#renderBasketHeader();
  };
}
