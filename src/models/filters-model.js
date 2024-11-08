import { FilterColor, FilterReason } from '../constants.js';
import Observable from '../framework/observable.js';

export default class FiltersModel extends Observable {
  #filterReason = FilterReason.All;
  #filterColors = [FilterColor.All];

  get filterReason() {
    return this.#filterReason;
  }

  get filterColors() {
    return this.#filterColors;
  }

  setfilterReason = (filterType, newFilterReason) => {
    this.#filterReason = newFilterReason;
    this._notify(filterType);
  };

  setFilterColor = (filterType, newFilterColor) => {
    if (newFilterColor === FilterColor.All) {
      this.#filterColors = [FilterColor.All];
      this._notify(filterType);
    } else {
      if (this.filterColors.length === 1 && this.filterColors[0] === FilterColor.All) {
        this.#filterColors = [newFilterColor];
        this._notify(filterType);
        return;
      }

      if (this.filterColors.includes(newFilterColor)) {

        if (this.filterColors.length === 1 && this.filterColors[0] !== FilterColor.All) {
          return;
        }

        const deletingFilterColor = this.#filterColors.indexOf(newFilterColor);

        this.#filterColors = [
          ...this.#filterColors.slice(0, deletingFilterColor),
          ...this.#filterColors.slice(deletingFilterColor + 1)
        ];

        this._notify(filterType);
        return;
      }

      this.#filterColors.push(newFilterColor);
      this._notify(filterType);
    }

  };
}
