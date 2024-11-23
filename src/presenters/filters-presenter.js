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

  get usedFilter() {
    return this.#filtersModel.usedFilter;
  }

  #renderFilterReason = () => {
    const previousFilterReasonView = this.#filterReasonView;

    this.#filterReasonView = new FilterReasonView(this.filterReason);
    this.#filterReasonView.setFilterReasonFormChangeHandler(this.#handleFilterReasonClick);

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
    this.#filterColorView.setFilterColorInputsClickHandler(this.#handleFilterColorClick);

    if (previousFilterColorView === null) {
      render(this.#filterColorView, this.#container);
      return;
    }

    replace(this.#filterColorView, previousFilterColorView);
    remove(previousFilterColorView);
  };

  #handleFilterChange = () => {
    switch(this.usedFilter) {
      case FilterType.COLOR:
        this.#renderFilterColor();
        break;
      case FilterType.REASON:
        this.#renderFilterReason();
        break;
    }
  };

  #handleFilterReasonClick = (newFilterReason) => {
    this.#filtersModel.setfilterReason(UpdateType.MAJOR, newFilterReason);
  };

  #handleFilterColorClick = (newFilterColor) => {
    this.#filtersModel.setFilterColor(UpdateType.MAJOR, newFilterColor);
  };

  initalize = () => {
    this.#renderFilterReason();
    this.#renderFilterColor();
  };
}
