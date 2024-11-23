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
import { AUTHORIZATION_TOKEN, END_POINT, FilterColor, FilterReason, UpdateType } from './constants.js';
import ProductsServiceApi from './service/products-service-api.js';

window.addEventListener('DOMContentLoaded', () => {
  iosVhFix();
});

export const productsServiceApi = new ProductsServiceApi(END_POINT, AUTHORIZATION_TOKEN);

const headerWrapper = document.querySelector('.header__wrapper');
const basketHeader = document.querySelector('.header__container');
const main = document.querySelector('main');
const footer = document.querySelector('footer');
const modalContentContainer = document.querySelector('.modal-product');

const productsModel = new ProductsModel(productsServiceApi);
const filtersModel = new FiltersModel();

const catalogPresenter = new CatalogPresenter(main, productsModel, filtersModel, renderExpandedProduct);
const infoPresenter = new InfoPresenter(main);
const filterPresenter = new FiltersPresenter(main, filtersModel);
const basketHeaderPresenter = new BasketHeaderPresenter(headerWrapper, productsModel, showBasket);
const basketPresenter = new BasketPresenter(footer, productsModel, redirectToCatalog, hideBasket, RenderPosition.BEFOREBEGIN);

basketHeader.remove();
basketHeaderPresenter.initalize();
basketPresenter.initalize();
infoPresenter.initalize();
filterPresenter.initalize();
catalogPresenter.initalize();
productsModel.initalize();

const basket = document.querySelector('.popup-deferred');

basket.style = 'display: none;';

function hideBasket() {
  basket.style = 'display: none;';
  main.style = '';
}

function showBasket() {
  basket.style = '';
  main.style = 'display: none;';
}

function redirectToCatalog() {
  catalogPresenter.swipeToCatalogTop();
  catalogPresenter.resetActiveSorting();
  filtersModel.setfilterReason(UpdateType.MAJOR, FilterReason.ALL);
  filtersModel.setFilterColor(UpdateType.MAJOR, FilterColor.ALL);
}

export const closeCallback = () => {
  const expandedProductDescription = document.querySelector('.product-description');
  const imageSlider = document.querySelector('.image-slider');
  const expandedProductErrorMessage = document.querySelector('.product-description__error-message');

  if (expandedProductErrorMessage) {
    expandedProductErrorMessage.remove();
  }

  if (imageSlider) {
    expandedProductDescription.remove();
    imageSlider.remove();
  } else {
    productsServiceApi.abortRequest();
  }
};

async function renderExpandedProduct(productId) {
  const modal = document.querySelector('.modal');
  modal.classList.add('is-loading');

  const imageSlider = new ImageSlider('.image-slider');
  initModals();

  modals.open('popup-data-attr');
  const expandedProductPresenter = new ExpandedProductContentPresenter(productId, productsModel, modalContentContainer);

  try {
    await expandedProductPresenter.renderExpandedProduct();
    imageSlider.init();
  } finally {
    modal.classList.remove('is-loading');
  }
}
