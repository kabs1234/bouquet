import { FilterColor } from '../constants.js';
import AbstractView from '../framework/view/abstract-view.js';

const createFilterColorOptionTemplate = (id, color, label, dataFilterColor, activeFilterColors) => (
  `<div class="filter-field-img filter-color__form-field--${color} filter-color__form-field">
    <input
      class="filter-field-img__input filter-color__form-field--${color} filter-color__form-field"
      type="checkbox"
      id="filter-colors-field-id-${id}"
      name="colors"
      value="color-${color}"
      ${activeFilterColors.includes(dataFilterColor) ? 'checked' : ''}
      data-filter-color="${dataFilterColor}">
    <label class="filter-field-img__label" for="filter-colors-field-id-${id}">
      <span class="filter-field-img__img">
        <picture>
          <source type="image/webp" srcset="img/content/filter-${color}.webp, img/content/filter-${color}@2x.webp 2x">
          <img src="img/content/filter-${color}.png" srcset="img/content/filter-${color}@2x.png 2x" width="130" height="130" alt="${label}">
        </picture>
      </span>
      <span class="filter-field-img__text">${label}</span>
    </label>
  </div>`
);

const createFilterColorTemplate = (activeFilterColors) => {
  const filterOptions = [
    { id: 0, color: 'all', label: 'все цвета', dataFilterColor: FilterColor.ALL },
    { id: 1, color: 'red', label: 'красный', dataFilterColor: FilterColor.RED },
    { id: 2, color: 'white', label: 'белый', dataFilterColor: FilterColor.WHITE },
    { id: 3, color: 'lilac', label: 'сиреневый', dataFilterColor: FilterColor.VIOLET },
    { id: 4, color: 'yellow', label: 'жёлтый', dataFilterColor: FilterColor.YELLOW },
    { id: 5, color: 'pink', label: 'розовый', dataFilterColor: FilterColor.PINK }
  ];

  const filterOptionsMarkup = filterOptions
    .map(({ id, color, label, dataFilterColor }) => createFilterColorOptionTemplate(id, color, label, dataFilterColor, activeFilterColors))
    .join('');

  return `
    <section class="filter-color">
      <div class="container">
        <h2 class="title title--h3 filter-color__title">Выберите основной цвет для букета</h2>
        <form class="filter-color__form" action="#" method="post">
          <div class="filter-color__form-fields" data-filter-color="filter">
            ${filterOptionsMarkup}
          </div>
          <button class="filter-color__btn visually-hidden" type="submit" tabindex="-1">применить фильтр</button>
        </form>
      </div>
    </section>
  `;
};

export default class FilterColorView extends AbstractView {
  #activeFilterColors = null;

  constructor(activeFilterColors) {
    super();
    this.#activeFilterColors = activeFilterColors;
  }

  get template() {
    return createFilterColorTemplate(this.#activeFilterColors);
  }

  setFilterColorInputsClickHandler = (callback) => {
    this._callback.filterColorInputsClick = callback;
    const filterColorInputs = this.element.querySelectorAll('.filter-field-img__input');

    filterColorInputs.forEach((colorInput) => colorInput.addEventListener('click', this.#filterColorInputsClickHandler));
  };

  #filterColorInputsClickHandler = (evt) => {
    evt.preventDefault();

    const newFilterColor = evt.currentTarget.dataset.filterColor;
    this._callback.filterColorInputsClick(newFilterColor);
  };
}
