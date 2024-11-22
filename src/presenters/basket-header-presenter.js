import { remove, render, replace } from '../framework/render.js';
import BasketHeaderView from '../views/basket-views/basket-header-view.js';

export default class BasketHeaderPresenter {
  #container = null;
  #productsModel = null;
  #basketHeaderView = null;
  #showBasket = null;

  constructor (container, productsModel, showBasket) {
    this.#container = container;
    this.#productsModel = productsModel;
    this.#showBasket = showBasket;

    this.#productsModel.addObserver(this.#renderBasketHeader);
  }

  #renderBasketHeader = () => {
    if (this.#productsModel.basket === null) {
      return;
    }

    const previousBasketHeaderView = this.#basketHeaderView;

    this.#basketHeaderView = new BasketHeaderView(this.#productsModel.basket);
    this.#basketHeaderView.setBasketButtonClickHandler(this.#renderBasket);

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

  #renderBasket = () => {
    this.#showBasket();
  };
}
