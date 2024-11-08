// Импорт вендоров и утилит, не удаляйте его
import './vendor';
import { ImageSlider } from './utils/image-slider';
import { iosVhFix } from './utils/ios-vh-fix';
import { modals, initModals } from './modals/init-modals';
import InfoPresenter from './presenters/info-presenter.js';
import BasketButtonPresenter from './presenters/basket-button-presenter.js';
import ProductsModel from './models/products-model.js';
import CatalogPresenter from './presenters/catalog-presenter.js';
import FiltersModel from './models/filters-model.js';
import FiltersPresenter from './presenters/filters-presenter.js';

// Ваши импорты...

// Код для работы попапов, не удаляйте его
window.addEventListener('DOMContentLoaded', () => {
  iosVhFix();

  window.addEventListener('load', () => {
    // Инициализация слайдера
    const imageSlider = new ImageSlider('.image-slider');
    imageSlider.init();

    // Инициализация попапов
    initModals();
  });

  // Пример кода для открытия попапа
  document
    .querySelector('.element-which-is-open-popup')
    .addEventListener('click', () => modals.open('popup-data-attr'));

  // Код отработает, если разметка попапа уже отрисована в index.html

  // Если вы хотите рисовать разметку попапа под каждое "открытие",
  // то не забудьте перенесети в код addEventListener инициализацию слайдера

  // ------------

  // Ваш код...
});

const main = document.querySelector('main');
const headerWrapper = document.querySelector('.header__wrapper');
const basketButton = document.querySelector('.header__container');

const productsModel = new ProductsModel();
const filtersModel = new FiltersModel();
const infoPresenter = new InfoPresenter(main);
const filterPresenter = new FiltersPresenter(main, filtersModel);
const catalogPresenter = new CatalogPresenter(main, productsModel, filtersModel);
const basketButtonPresenter = new BasketButtonPresenter(headerWrapper, productsModel);

basketButton.remove();
basketButtonPresenter.initalize();
infoPresenter.initalize();
filterPresenter.initalize();
catalogPresenter.initalize();
