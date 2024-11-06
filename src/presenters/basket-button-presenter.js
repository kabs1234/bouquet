import { remove, render, replace } from "../framework/render";
import BasketButtonView from "../views/basket-button-view.js";

export default class BasketButtonPresenter {
  #container = null;
  #basketModel = null;
  #basketButtonView = null;

  constructor (container, basketModel) {
    this.#container = container;
    this.#basketModel = basketModel;
  }

  #renderBasketButton = () => {
    const previousBasketButtonView = this.#basketButtonView;

    this.#basketButtonView = new BasketButtonView(this.#basketModel.basket);

    if (previousBasketButtonView === null) {
      render(this.#basketButtonView, this.#container);
      return;
    }

    replace(previousBasketButtonView, this.#basketButtonView);
    remove(previousBasketButtonView);
  }

  initalize = () => {
    this.#renderBasketButton();
  }
}
