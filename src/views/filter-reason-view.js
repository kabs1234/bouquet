import { FilterReason } from '../constants.js';
import AbstractView from '../framework/view/abstract-view.js';

const createFilterOptionTemplate = (id, reason, label, dataFilterReason, activeFilterReason) => (
  `<div class="filter-field-text filter-reason__form-field--for-${reason} filter-reason__form-field">
    <input
      class="filter-field-text__input filter-reason__form-field--for-${reason} filter-reason__form-field"
      type="radio"
      id="filter-reason-field-id-${id}"
      name="reason"
      value="for-${reason}"
      ${activeFilterReason === dataFilterReason ? 'checked' : ''}>
    <label class="filter-field-text__label" for="filter-reason-field-id-${id}">
      <span class="filter-field-text__text" data-filter-reason="${dataFilterReason}">${label}</span>
    </label>
  </div>`
);

const createFilterReasonTemplate = (activeFilterReason) => {
  const filterOptions = [
    { id: 0, reason: 'all', label: 'Для всех', dataFilterReason: FilterReason.ALL },
    { id: 1, reason: 'birthday', label: 'Имениннику', dataFilterReason: FilterReason.BIRTHDAY },
    { id: 2, reason: 'bride', label: 'Невесте', dataFilterReason: FilterReason.BRIDE },
    { id: 3, reason: 'mother', label: 'Маме', dataFilterReason: FilterReason.MOTHER },
    { id: 4, reason: 'colleague', label: 'Коллеге', dataFilterReason: FilterReason.COLLEAGUE },
    { id: 5, reason: 'darling', label: 'Любимой', dataFilterReason: FilterReason.DARLING }
  ];

  const filterOptionsMarkup = filterOptions
    .map(({ id, reason, label, dataFilterReason }) => createFilterOptionTemplate(id, reason, label, dataFilterReason, activeFilterReason))
    .join('');

  return `
    <section class="filter-reason">
      <div class="container">
        <h2 class="title title--h3 filter-reason__title">Выберите повод для букета</h2>
        <form class="filter-reason__form" action="#" method="post">
          <div class="filter-reason__form-fields">
            ${filterOptionsMarkup}
          </div>
          <button class="filter-reason__btn visually-hidden" type="submit" tabindex="-1">применить фильтр</button>
        </form>
      </div>
    </section>
  `;
};

export default class FilterReasonView extends AbstractView {
  #activeFilterReason = null;

  constructor(activeFilterReason) {
    super();
    this.#activeFilterReason = activeFilterReason;
  }

  get template() {
    return createFilterReasonTemplate(this.#activeFilterReason);
  }

  setFilterReasonFormChangeHandler = (callback) => {
    this._callback.filterReasonFormChange = callback;
    this.element.querySelector('.filter-reason__form').addEventListener('click', this.#filterReasonFormChangeHandler);
  };

  #filterReasonFormChangeHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName === 'SPAN') {
      const newFilterReason = evt.target.dataset.filterReason;
      this._callback.filterReasonFormChange(newFilterReason);
    }
  };
}
