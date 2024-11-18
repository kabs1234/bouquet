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

  setfilterReason = (updateType, newFilterReason) => {
    this.#filterReason = newFilterReason;
    this._notify(updateType);
  };

  setFilterColor = (updateType, newFilterColor) => {
    if (newFilterColor === FilterColor.All) {
      this.#filterColors = [FilterColor.All];
      this._notify(updateType);
    } else {
      if (this.filterColors.length === 1 && this.filterColors[0] === FilterColor.All) {
        this.#filterColors = [newFilterColor];
        this._notify(updateType);
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

        this._notify(updateType);
        return;
      }

      this.#filterColors.push(newFilterColor);
      this._notify(updateType);
    }

  };
}
