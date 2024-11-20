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
import { AUTHORIZATION_TOKEN, END_POINT, FilterColor, FilterReason, FilterType } from './constants.js';
import ProductsServiceApi from './service/products-service-api.js';

window.addEventListener('DOMContentLoaded', () => {
  iosVhFix();
});

const productsServiceApi = new ProductsServiceApi(END_POINT, AUTHORIZATION_TOKEN);

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
const basketHeaderPresenter = new BasketHeaderPresenter(headerWrapper, productsModel, renderBasket, hideMain);

productsModel.initalize();
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

  const basketPresenter = new BasketPresenter(footer, productsModel, redirectToCatalog, showMain, RenderPosition.BEFOREBEGIN);

  basketPresenter.initalize();
}

async function renderExpandedProduct(productId) {
  catalogPresenter.block();

  try {
    const expandedProductData = await productsModel.getExpandedProduct(productId);

    const expandedProductPresenter = new ExpandedProductContentPresenter(expandedProductData, productsModel, modalContentContainer);

    const imageSlider = new ImageSlider('.image-slider');

    initModals();

    modals.open('popup-data-attr');

    expandedProductPresenter.renderExpandedProduct();
    imageSlider.init();
  } catch (err) {
    throw new Error(`An error occurred expanding product: ${err.message, err.stack}`);
  } finally {
    catalogPresenter.unblock();
  }
}
