import { remove, render, replace } from '../framework/render';
import FilterColorView from '../views/filter-color-view';
import FilterReasonView from '../views/filter-reason-view';

export default class FilterPresenter {
  #container = null;
  #filterColorView = null;
  #filterReasonView = null;

  constructor(container) {
    this.#container = container;
  }

  #renderFilterReason = () => {
    const previousFilterReasonView = this.#filterReasonView;

    this.#filterReasonView = new FilterReasonView();

    if (previousFilterReasonView === null) {
      render(this.#filterReasonView, this.#container);
      return;
    }

    replace(previousFilterReasonView, this.#filterReasonView);
    remove(previousFilterReasonView);
  };

  #renderFilterColor = () => {
    const previousFilterColorView = this.#filterColorView;

    this.#filterColorView = new FilterColorView();

    if (previousFilterColorView === null) {
      render(this.#filterColorView, this.#container);
      return;
    }

    replace(previousFilterColorView, this.#filterColorView);
    remove(previousFilterColorView);
  };

  initalize = () => {
    this.#renderFilterReason();
    this.#renderFilterColor();
  };
}
