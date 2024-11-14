// Импорт вендоров и утилит, не удаляйте его
import './vendor';
import { ImageSlider } from './utils/image-slider';
import { iosVhFix } from './utils/ios-vh-fix';
import { modals, initModals } from './modals/init-modals';
import InfoPresenter from './presenters/info-presenter.js';
import BasketHeaderPresenter from './presenters/basket-header-presenter.js';
import ProductsModel from './models/products-model.js';
import CatalogPresenter from './presenters/catalog-presenter.js';
import FiltersModel from './models/filters-model.js';
import FiltersPresenter from './presenters/filters-presenter.js';
import BasketPresenter from './presenters/basket-presenter.js';

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

  // Код отработает, если разметка попапа уже отрисована в index.html

  // Если вы хотите рисовать разметку попапа под каждое "открытие",
  // то не забудьте перенесети в код addEventListener инициализацию слайдера

  // ------------

  // Ваш код...
});


const pageContentWrapper = document.querySelector('.wrapper');
const main = document.querySelector('main');
const headerWrapper = document.querySelector('.header__wrapper');
const basketHeader = document.querySelector('.header__container');

const productsModel = new ProductsModel();
const filtersModel = new FiltersModel();

const catalogPresenter = new CatalogPresenter(main, productsModel, filtersModel);
const infoPresenter = new InfoPresenter(main);
const filterPresenter = new FiltersPresenter(main, filtersModel);
const basketHeaderPresenter = new BasketHeaderPresenter(headerWrapper, productsModel, renderBasket, hideMain);

basketHeader.remove();
basketHeaderPresenter.initalize();
infoPresenter.initalize();
filterPresenter.initalize();
catalogPresenter.initalize();

function hideMain() {
  main.style = 'display: none;';
}

function showMain() {
  main.style = '';
}

function renderBasket() {
  const isBasketRendered = Boolean(document.querySelector('.popup-deferred'));

  if (isBasketRendered) {
    return;
  }

  const basketPresenter = new BasketPresenter(pageContentWrapper, productsModel, catalogPresenter.swipeToCatalogTop, showMain);

  basketPresenter.initalize();
}
