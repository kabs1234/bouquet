// Импорт вендоров и утилит, не удаляйте его
import './vendor';
import { iosVhFix } from './utils/ios-vh-fix';
import InfoPresenter from './presenters/info-presenter.js';
import BasketHeaderPresenter from './presenters/basket-header-presenter.js';
import ProductsModel from './models/products-model.js';
import CatalogPresenter from './presenters/catalog-presenter.js';
import FiltersModel from './models/filters-model.js';
import FiltersPresenter from './presenters/filters-presenter.js';
import BasketPresenter from './presenters/basket-presenter.js';
import ExpandedProductContentPresenter from './presenters/expanded-product-content-presenter.js';
import { ImageSlider } from './utils/image-slider.js';
import { initModals, modals } from './modals/init-modals.js';
import { RenderPosition } from './framework/render.js';
import { FilterColor, FilterReason, FilterType } from './constants.js';

// Ваши импорты...

// Код для работы попапов, не удаляйте его
window.addEventListener('DOMContentLoaded', () => {
  iosVhFix();
  // Пример кода для открытия попапа

  // Код отработает, если разметка попапа уже отрисована в index.html

  // Если вы хотите рисовать разметку попапа под каждое "открытие",
  // то не забудьте перенесети в код addEventListener инициализацию слайдера

  // ------------

  // Ваш код...
});

const headerWrapper = document.querySelector('.header__wrapper');
const basketHeader = document.querySelector('.header__container');
const main = document.querySelector('main');
const footer = document.querySelector('footer');
const modalContentContainer = document.querySelector('.modal-product');

const productsModel = new ProductsModel();
const filtersModel = new FiltersModel();

const catalogPresenter = new CatalogPresenter(main, productsModel, filtersModel, renderExpandedProduct);
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

function redirectToCatalog() {
  showMain();
  catalogPresenter.swipeToCatalogTop();
  catalogPresenter.resetActiveSorting();
  filtersModel.setfilterReason(FilterType.Reason, FilterReason.All);
  filtersModel.setFilterColor(FilterType.Color, FilterColor.All);
}

function renderBasket() {
  const isBasketRendered = Boolean(document.querySelector('.popup-deferred'));

  if (isBasketRendered) {
    return;
  }

  const basketPresenter = new BasketPresenter(footer, productsModel, redirectToCatalog, RenderPosition.BEFOREBEGIN);

  basketPresenter.initalize();
}

function renderExpandedProduct(productData) {
  const expandedProductPresenter = new ExpandedProductContentPresenter(productData, productsModel, modalContentContainer);

  const imageSlider = new ImageSlider('.image-slider');

  initModals();

  modals.open('popup-data-attr');

  expandedProductPresenter.renderExpandedProduct();
  imageSlider.init();
}
