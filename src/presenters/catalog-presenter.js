import { remove, render } from '../framework/render.js';
import CatalogButtonsView from '../views/catalog-buttons-view.js';
import CatalogProductsContainerView from '../views/catalog-products-container-view.js';
import CatalogHeaderView from '../views/catalog-header-view.js';
import CatalogProductView from '../views/catalog-product-view.js';
import CatalogView from '../views/catalog-container-view.js';
import { FilterColor, FilterReason } from '../constants.js';

const PRODUCTS_RENDERING_AMOUNT_STEP = 6;

export default class CatalogPresenter {
  #container = null;
  #productsModel = null;
  #filtersModel = null;
  #catalogView = new CatalogView();
  #catalogContainer = this.#catalogView.element.firstElementChild;
  #catalogHeaderView = new CatalogHeaderView();
  #catalogButtonsView = null;
  #catalogProductsContainerView = null;
  #showedProductsAmount = 0;
  #productsToRender = this.#showedProductsAmount + PRODUCTS_RENDERING_AMOUNT_STEP;

  constructor(container, productsModel, filtersModel) {
    this.#container = container;
    this.#productsModel = productsModel;
    this.#filtersModel = filtersModel;

    this.#filtersModel.addObserver(this.#handleFilterChange);
  }

  get products() {
    const productsCopy = [...this.#productsModel.products];

    if (this.#filtersModel.filterReason === FilterReason.All && this.#filtersModel.filterColors[0] === FilterColor.All) {
      return productsCopy;
    }

    if (this.#filtersModel.filterReason === FilterReason.All) {
      return productsCopy.filter((product) => this.#filtersModel.filterColors.includes(product.color));
    }

    if (this.#filtersModel.filterColors[0] === FilterColor.All) {
      return productsCopy.filter((product) => product.type === this.#filtersModel.filterReason);
    }

    return productsCopy.filter((product) => this.#filtersModel.filterColors.includes(product.color) && product.type === this.#filtersModel.filterReason);
  }

  #renderCatalogButtons = () => {
    this.#catalogButtonsView = new CatalogButtonsView();

    render(this.#catalogButtonsView, this.#catalogContainer);
  };

  #renderCatalogHeader = () => {
    render(this.#catalogHeaderView, this.#catalogContainer);
  };

  #handleFilterChange = () => {
    this.#showedProductsAmount = 0;
    this.#productsToRender = this.#showedProductsAmount + PRODUCTS_RENDERING_AMOUNT_STEP;

    this.#clearProductsContainer();
    this.#clearCatalogButtons();
    this.#renderCatalogProductsContainer();
    this.#renderCatalogProducts();

    if (this.products.length > this.#productsToRender) {
      this.#renderCatalogButtons();
      this.#setHandlers();
    }
  };

  #clearProductsContainer = () => {
    remove(this.#catalogProductsContainerView);
    this.#catalogProductsContainerView = null;
  };

  #clearCatalogButtons = () => {
    remove(this.#catalogButtonsView);
    this.#catalogButtonsView = null;
  };

  #renderCatalogProducts = () => {
    this.products.slice(this.#showedProductsAmount, this.#productsToRender).forEach((product) => {
      this.#renderCatalogProduct(product);
    });
  };

  #swipeToCatalogTop = () => {
    this.#catalogView.element.scrollIntoView();
  };

  #renderCatalogProduct = (product) => {
    const catalogProduct = new CatalogProductView(product);

    render(catalogProduct, this.#catalogProductsContainerView.element);
  };

  #renderMoreProducts = () => {
    this.#showedProductsAmount += PRODUCTS_RENDERING_AMOUNT_STEP;
    this.#productsToRender += PRODUCTS_RENDERING_AMOUNT_STEP;

    this.#renderCatalogProducts();

    if (this.products.length < this.#productsToRender) {
      this.#catalogButtonsView.removeShowMoreButton();
    }
  };

  #setHandlers = () => {
    this.#catalogButtonsView.setShowMoreButtonClickHandler(this.#renderMoreProducts);
    this.#catalogButtonsView.setToTopButtonClickHandler(this.#swipeToCatalogTop);
  };

  #renderCatalogProductsContainer = () => {
    this.#catalogProductsContainerView = new CatalogProductsContainerView();

    render(this.#catalogProductsContainerView, this.#catalogContainer);
  };

  #renderCatalog = () => {
    render(this.#catalogView, this.#container);
  };

  initalize = () => {
    this.#renderCatalog();

    this.#renderCatalogHeader();
    this.#renderCatalogProductsContainer();
    this.#renderCatalogProducts();

    if (this.products.length > this.#productsToRender) {
      this.#renderCatalogButtons();
      this.#setHandlers();
    }
  };
}
