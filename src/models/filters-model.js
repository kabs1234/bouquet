import { FilterColor, FilterReason } from '../constants.js';
import Observable from '../framework/observable.js';

export default class FiltersModel extends Observable {
  #filterReason = FilterReason.ALL;
  #filterColors = [FilterColor.ALL];

  get filterReason() {
    return this.#filterReason;
  }

  get filterColors() {
    return this.#filterColors;
  }

  setfilterReason = (updateType, newFilterReason) => {
    this.#filterReason = newFilterReason;
    this._notify(updateType);
  };

  setFilterColor = (updateType, newFilterColor) => {
    if (newFilterColor === FilterColor.ALL) {
      this.#filterColors = [FilterColor.ALL];
      this._notify(updateType);
      return;
    }

    const isAllFilterActive = this.filterColors.length === 1 && this.filterColors[0] === FilterColor.ALL;

    if (isAllFilterActive) {
      this.#filterColors = [newFilterColor];
      this._notify(updateType);
      return;
    }

    const colorIndex = this.filterColors.indexOf(newFilterColor);

    if (colorIndex !== -1) {
      if (this.filterColors.length === 1) {
        return;
      }

      this.#filterColors.splice(colorIndex, 1);
      this._notify(updateType);
      return;
    }

    this.#filterColors.push(newFilterColor);
    this._notify(updateType);
  };

}
