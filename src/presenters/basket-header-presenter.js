import { remove, render, replace } from '../framework/render.js';
import BasketHeaderView from '../views/basket-views/basket-header-view.js';

export default class BasketHeaderPresenter {
  #container = null;
  #productsModel = null;
  #basketHeaderView = null;
  #basketRenderingFunction = null;

  constructor (container, productsModel, basketRenderingFunction) {
    this.#container = container;
    this.#productsModel = productsModel;
    this.#basketRenderingFunction = basketRenderingFunction;
  }

  #renderBasketHeader = () => {
    const previousBasketHeaderView = this.#basketHeaderView;

    this.#basketHeaderView = new BasketHeaderView(this.#productsModel.basket);
    this.#basketHeaderView.setBasketButtonClickHandler(this.#basketRenderingFunction);

    if (previousBasketHeaderView === null) {
      render(this.#basketHeaderView, this.#container);
      return;
    }

    replace(previousBasketHeaderView, this.#basketHeaderView);
    remove(previousBasketHeaderView);
  };

  initalize = () => {
    this.#renderBasketHeader();
  };
}
