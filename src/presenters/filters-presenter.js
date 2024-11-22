import { FilterType, UpdateType } from '../constants';
import { remove, render, replace } from '../framework/render';
import FilterColorView from '../views/filter-color-view';
import FilterReasonView from '../views/filter-reason-view';

export default class FiltersPresenter {
  #container = null;
  #filterColorView = null;
  #filterReasonView = null;
  #filtersModel = null;

  constructor(container, filtersModel) {
    this.#container = container;
    this.#filtersModel = filtersModel;

    this.#filtersModel.addObserver(this.#handleFilterChange);
  }

  get filterReason() {
    return this.#filtersModel.filterReason;
  }

  get filterColors() {
    return this.#filtersModel.filterColors;
  }

  #renderFilterReason = () => {
    const previousFilterReasonView = this.#filterReasonView;

    this.#filterReasonView = new FilterReasonView(this.filterReason);
    this.#filterReasonView.setFilterReasonFormChangeHandler(this.#setFilterReason);

    if (previousFilterReasonView === null) {
      render(this.#filterReasonView, this.#container);
      return;
    }

    replace(this.#filterReasonView, previousFilterReasonView);
    remove(previousFilterReasonView);
  };

  #renderFilterColor = () => {
    const previousFilterColorView = this.#filterColorView;

    this.#filterColorView = new FilterColorView(this.filterColors);
    this.#filterColorView.setFilterColorInputsClickHandler(this.#setFilterColor);

    if (previousFilterColorView === null) {
      render(this.#filterColorView, this.#container);
      return;
    }

    replace(this.#filterColorView, previousFilterColorView);
    remove(previousFilterColorView);
  };

  #handleFilterChange = () => {
    this.#renderFilterReason();
    this.#renderFilterColor();
  };

  #setFilterReason = (newFilterReason) => {
    this.#filtersModel.setfilterReason(UpdateType.Major, newFilterReason);
  };

  #setFilterColor = (newFilterColor) => {
    this.#filtersModel.setFilterColor(UpdateType.Major, newFilterColor);
  };

  initalize = () => {
    this.#renderFilterReason();
    this.#renderFilterColor();
  };
}
