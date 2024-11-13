import { remove, render, replace } from '../framework/render.js';
import { FilterColor, FilterReason, SortByPrice } from '../constants.js';
import { modals } from '../modals/init-modals.js';
import CatalogView from '../views/catalog-views/catalog-view.js';
import CatalogContainerView from '../views/catalog-views/catalog-container-view.js';
import CatalogButtonsView from '../views/catalog-views/catalog-buttons-view.js';
import CatalogProductsContainerView from '../views/catalog-views/catalog-products-container-view.js';
import CatalogProductView from '../views/catalog-views/catalog-product-view.js';
import CatalogProductsEmptyMessageView from '../views/catalog-views/catalog-products-empty-message-view.js';
import CatalogSortingsView from '../views/catalog-views/catalog-sortings-view.js';

const PRODUCTS_RENDERING_AMOUNT_STEP = 6;

export default class CatalogPresenter {
  #container = null;
  #productsModel = null;
  #filtersModel = null;

  #catalogView = new CatalogView();

  #catalogProductsEmptyMessageView = null;
  #catalogSortingsView = null;
  #catalogButtonsView = null;
  #catalogProductsContainerView = null;

  #catalogContainerView = new CatalogContainerView();
  #activeSorting = SortByPrice.Increase;

  #showedProductsAmount = 0;
  #productsToRender = this.#showedProductsAmount + PRODUCTS_RENDERING_AMOUNT_STEP;

  constructor(container, productsModel, filtersModel) {
    this.#container = container;
    this.#productsModel = productsModel;
    this.#filtersModel = filtersModel;

    this.#filtersModel.addObserver(this.#handleViewChange);
  }

  get products() {
    let productsCopy = [...this.#productsModel.products];

    productsCopy = this.#sortProductsByPrice(productsCopy);

    if (this.#filtersModel.filterReason === FilterReason.All && this.#filtersModel.filterColors[0] === FilterColor.All) {
      return productsCopy;
    }

    if (this.#filtersModel.filterReason === FilterReason.All) {
      return productsCopy.filter((product) => this.#filtersModel.filterColors.includes(product.color));
    }

    if (this.#filtersModel.filterColors[0] === FilterColor.All) {
      return productsCopy.filter((product) => product.type === this.#filtersModel.filterReason);
    }

    return productsCopy.filter((product) => this.#filtersModel.filterColors.includes(product.color)
    && product.type === this.#filtersModel.filterReason);
  }

  #renderCatalogButtons = () => {
    const previousСatalogButtonsView = this.#catalogButtonsView;

    this.#catalogButtonsView = new CatalogButtonsView();

    if (previousСatalogButtonsView === null) {
      render(this.#catalogButtonsView, this.#catalogContainerView.element);
      return;
    }

    replace(this.#catalogButtonsView, previousСatalogButtonsView);
    remove(previousСatalogButtonsView);
  };

  #renderCatalogSortings = () => {
    const previousCatalogSortingsView = this.#catalogSortingsView;

    this.#catalogSortingsView = new CatalogSortingsView(this.#activeSorting);
    this.#catalogSortingsView.setIncreaseButtonClickHandler(this.#setSortingByPriceToIncreasing);
    this.#catalogSortingsView.setDecreaseButtonClickHandler(this.#setSortingByPriceToDecreasing);

    if (previousCatalogSortingsView === null) {
      render(this.#catalogSortingsView, this.#catalogContainerView.element);
      return;
    }

    replace(this.#catalogSortingsView, previousCatalogSortingsView);
    remove(previousCatalogSortingsView);
  };

  #setSortingByPriceToIncreasing = () => {
    this.#activeSorting = SortByPrice.Increase;
    this.#handleViewChange();
  };

  #setSortingByPriceToDecreasing = () => {
    this.#activeSorting = SortByPrice.Decrease;
    this.#handleViewChange();
  };

  #handleViewChange = () => {
    this.#showedProductsAmount = 0;
    this.#productsToRender = this.#showedProductsAmount + PRODUCTS_RENDERING_AMOUNT_STEP;

    this.#clearProductsContainerView();
    this.#clearCatalogButtonsView();
    this.#clearСatalogProductsEmptyMessageView();

    this.#renderCatalogSortings();

    if (this.products.length === 0) {
      this.#renderCatalogProductsEmptyMessage();
      this.#renderCatalogButtons();
      this.#setHandlers();
      this.#catalogButtonsView.removeShowMoreButton();
      return;
    }

    this.#renderCatalogProductsContainer();
    this.#renderCatalogProducts();

    if (this.products.length > this.#productsToRender) {
      this.#renderCatalogButtons();
      this.#setHandlers();
    }
  };

  #clearСatalogProductsEmptyMessageView = () => {
    remove(this.#catalogProductsEmptyMessageView);
    this.#catalogProductsEmptyMessageView = null;
  };

  #clearProductsContainerView = () => {
    remove(this.#catalogProductsContainerView);
    this.#catalogProductsContainerView = null;
  };

  #clearCatalogButtonsView = () => {
    remove(this.#catalogButtonsView);
    this.#catalogButtonsView = null;
  };

  #renderCatalogProductsEmptyMessage = () => {
    const previousCatalogProductsEmptyMessageView = this.#catalogProductsEmptyMessageView;

    this.#catalogProductsEmptyMessageView = new CatalogProductsEmptyMessageView();

    if (previousCatalogProductsEmptyMessageView === null) {
      render(this.#catalogProductsEmptyMessageView, this.#catalogContainerView.element);
      return;
    }

    replace(this.#catalogProductsEmptyMessageView, previousCatalogProductsEmptyMessageView);
    remove(previousCatalogProductsEmptyMessageView);
  };

  #renderCatalogProducts = () => {
    this.products.slice(this.#showedProductsAmount, this.#productsToRender).forEach((product) => {
      this.#renderCatalogProduct(product);
    });
  };

  swipeToCatalogTop = () => {
    this.#catalogView.element.scrollIntoView();
  };

  #renderCatalogProduct = (product) => {
    const catalogProduct = new CatalogProductView(product, this.#productsModel.basket);
    catalogProduct.setItemCardClickHandler(() => modals.open('popup-data-attr'));

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
    this.#catalogButtonsView.setToTopButtonClickHandler(this.swipeToCatalogTop);
  };

  #sortProductsByIncreasingPrice = (products) => products.sort((a, b) => a.price - b.price);

  #sortProductsByDecreasingPrice = (products) => products.sort((a, b) => b.price - a.price);

  #sortProductsByPrice = (products) => {
    if (this.#activeSorting === SortByPrice.Increase) {
      return this.#sortProductsByIncreasingPrice(products);
    } else if (this.#activeSorting === SortByPrice.Decrease) {
      return this.#sortProductsByDecreasingPrice(products);
    }
  };

  #renderCatalogProductsContainer = () => {
    const previousCatalogProductsContainerView = this.#catalogProductsContainerView;

    this.#catalogProductsContainerView = new CatalogProductsContainerView();

    if (previousCatalogProductsContainerView === null) {
      render(this.#catalogProductsContainerView, this.#catalogContainerView.element);
      return;
    }

    replace(this.#catalogProductsContainerView, previousCatalogProductsContainerView);
    remove(previousCatalogProductsContainerView);
  };

  #renderCatalog = () => {
    render(this.#catalogView, this.#container);
  };

  #renderCatalogContainer = () => {
    render(this.#catalogContainerView, this.#catalogView.element);
  };

  initalize = () => {
    this.#renderCatalog();
    this.#renderCatalogContainer();

    this.#renderCatalogSortings();
    this.#renderCatalogProductsContainer();
    this.#renderCatalogProducts();

    if (this.products.length > this.#productsToRender) {
      this.#renderCatalogButtons();
      this.#setHandlers();
    }
  };
}
