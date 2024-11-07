// Импорт вендоров и утилит, не удаляйте его
import './vendor';
import { ImageSlider } from './utils/image-slider';
import { iosVhFix } from './utils/ios-vh-fix';
import { modals, initModals } from './modals/init-modals';
import InfoPresenter from './presenters/info-presenter';
import FilterPresenter from './presenters/filter-presenter';
import BasketButtonPresenter from './presenters/basket-button-presenter';
import ProductsModel from './models/products-model';
import CatalogPresenter from './presenters/catalog-presenter';

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
const infoPresenter = new InfoPresenter(main);
const filterPresenter = new FilterPresenter(main);
const catalogPresenter = new CatalogPresenter(main, productsModel);
const basketButtonPresenter = new BasketButtonPresenter(headerWrapper, productsModel);

basketButton.remove();
basketButtonPresenter.initalize();
infoPresenter.initalize();
filterPresenter.initalize();
catalogPresenter.initalize();
