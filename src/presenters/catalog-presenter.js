import { remove, render, replace } from '../framework/render.js';
import { FilterColor, FilterReason, MIN_BLOCK_TIME, SortByPrice, TIME_BEFORE_BLOCK, UpdateType } from '../constants.js';
import CatalogView from '../views/catalog-views/catalog-view.js';
import CatalogContainerView from '../views/catalog-views/catalog-container-view.js';
import CatalogButtonsView from '../views/catalog-views/catalog-buttons-view.js';
import CatalogProductsContainerView from '../views/catalog-views/catalog-products-container-view.js';
import CatalogProductView from '../views/catalog-views/catalog-product-view.js';
import CatalogProductsEmptyMessageView from '../views/catalog-views/catalog-products-empty-message-view.js';
import CatalogSortingsView from '../views/catalog-views/catalog-sortings-view.js';
import CatalogLoadingMessageView from '../views/catalog-views/catalog-loading-message-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import CatalogLoadingErrorMessageView from '../views/catalog-views/catalog-loading-error-message-view.js';

const PRODUCTS_RENDERING_AMOUNT_STEP = 6;

export default class CatalogPresenter extends UiBlocker {
  #container = null;
  #productsModel = null;
  #filtersModel = null;
  #renderExpandedProductFunction = null;

  #catalogView = new CatalogView();

  #catalogProductsEmptyMessageView = null;
  #catalogSortingsView = null;
  #catalogButtonsView = null;
  #catalogProductsContainerView = null;
  #catalogContainerView = new CatalogContainerView();

  #catalogLoadingMessageView = new CatalogLoadingMessageView();
  #catalogLoadingErrorMessageView = new CatalogLoadingErrorMessageView();

  #activeSorting = SortByPrice.INCREASE;

  #showedProductsAmount = 0;
  #productsToRender = this.#showedProductsAmount + PRODUCTS_RENDERING_AMOUNT_STEP;
  #productsViews = new Map();

  #isLoading = true;

  constructor(container, productsModel, filtersModel, renderExpandedProductFunction) {
    super(TIME_BEFORE_BLOCK, MIN_BLOCK_TIME);

    this.#container = container;
    this.#productsModel = productsModel;
    this.#filtersModel = filtersModel;
    this.#renderExpandedProductFunction = renderExpandedProductFunction;

    this.#filtersModel.addObserver(this.#handleViewChange);
    this.#productsModel.addObserver(this.#handleViewChange);
  }

  get products() {
    let productsCopy = [...this.#productsModel.products];

    productsCopy = this.#sortProductsByPrice(productsCopy);

    if (this.#filtersModel.filterReason === FilterReason.ALL && this.#filtersModel.filterColors[0] === FilterColor.ALL) {
      return productsCopy;
    }

    if (this.#filtersModel.filterReason === FilterReason.ALL) {
      return productsCopy.filter((product) => this.#filtersModel.filterColors.includes(product.color));
    }

    if (this.#filtersModel.filterColors[0] === FilterColor.ALL) {
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

  #renderCatalogLoadingMessage = () => {
    render(this.#catalogLoadingMessageView, this.#catalogContainerView.element);
  };

  #renderCatalogErrorLoadingMessage = () => {
    render(this.#catalogLoadingErrorMessageView, this.#catalogContainerView.element);
  };

  #handleViewChange = (updateType, productId) => {
    switch (updateType) {
      case UpdateType.INITIALIZE:
        this.#isLoading = false;
        this.#catalogLoadingMessageView = this.#destroyView(this.#catalogLoadingMessageView);
        this.initalize();
        break;
      case UpdateType.MAJOR:
        this.#resetCatalogProductsList();
        break;
      case UpdateType.LOADING_ERROR:
        this.#catalogLoadingMessageView = this.#destroyView(this.#catalogLoadingMessageView);
        this.#renderCatalogErrorLoadingMessage();
        break;
      case UpdateType.CHANGING_PRODUCT_ERROR:
        this.#productsViews.get(productId).shake();
        break;
    }

    this.unblock();
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
    const productsToRender = this.products.slice(this.#showedProductsAmount, this.#productsToRender);

    productsToRender.forEach((product) => {
      this.#renderCatalogProduct(product);
    });
  };

  #renderCatalogProduct = (product) => {
    const catalogProductView = new CatalogProductView(product, this.#productsModel.basket);
    this.#productsViews.set(product.id, catalogProductView);

    catalogProductView.setProductClickHandler(this.#renderExpandedProductFunction);
    catalogProductView.setFavoriteButtonClickHandler(this.#changeFavoriteButtonState);

    render(catalogProductView, this.#catalogProductsContainerView.element);
  };

  #renderMoreProducts = () => {
    this.#showedProductsAmount += PRODUCTS_RENDERING_AMOUNT_STEP;
    this.#productsToRender += PRODUCTS_RENDERING_AMOUNT_STEP;

    this.#renderCatalogProducts();

    if (this.products.length < this.#productsToRender) {
      this.#catalogButtonsView.removeShowMoreButton();
    }
  };

  #resetCatalogProductsList = () => {
    this.#showedProductsAmount = 0;
    this.#productsToRender = this.#showedProductsAmount + PRODUCTS_RENDERING_AMOUNT_STEP;

    this.#catalogProductsContainerView = this.#destroyView(this.#catalogProductsContainerView);
    this.#catalogButtonsView = this.#destroyView(this.#catalogButtonsView);
    this.#catalogProductsEmptyMessageView = this.#destroyView(this.#catalogProductsEmptyMessageView);

    this.#renderCatalogSortings();

    if (this.products.length === 0) {
      this.#renderCatalogProductsEmptyMessage();
      this.#renderCatalogButtons();
      this.#setCatalogButtonsHandlers();
      this.#catalogButtonsView.removeShowMoreButton();
      return;
    }

    this.#renderCatalogProductsContainer();
    this.#renderCatalogProducts();

    if (this.products.length > this.#productsToRender) {
      this.#renderCatalogButtons();
      this.#setCatalogButtonsHandlers();
    }
  };

  #changeFavoriteButtonState = (productId) => {
    const productsId = Object.keys(this.#productsModel.basket.products);
    const isFavorite = productsId.includes(productId);

    this.block();

    if (isFavorite) {
      this.#productsModel.deleteProductFromBasket(productId);
    } else {
      this.#productsModel.addProductToBasket(productId);
    }
  };

  #setCatalogButtonsHandlers = () => {
    this.#catalogButtonsView.setShowMoreButtonClickHandler(this.#renderMoreProducts);
    this.#catalogButtonsView.setToTopButtonClickHandler(this.swipeToCatalogTop);
  };

  #sortProductsByIncreasingPrice = (products) => products.sort((a, b) => a.price - b.price);

  #sortProductsByDecreasingPrice = (products) => products.sort((a, b) => b.price - a.price);

  #setSortingByPriceToIncreasing = () => {
    this.#activeSorting = SortByPrice.INCREASE;
    this.#handleViewChange(UpdateType.MAJOR);
  };

  #setSortingByPriceToDecreasing = () => {
    this.#activeSorting = SortByPrice.DECREASE;
    this.#handleViewChange(UpdateType.MAJOR);
  };

  #sortProductsByPrice = (products) => {
    if (this.#activeSorting === SortByPrice.INCREASE) {
      return this.#sortProductsByIncreasingPrice(products);
    } else if (this.#activeSorting === SortByPrice.DECREASE) {
      return this.#sortProductsByDecreasingPrice(products);
    }
  };

  #destroyView = (view) => {
    remove(view);
    return null;
  };

  swipeToCatalogTop = () => {
    this.#catalogView.element.scrollIntoView();
  };

  resetActiveSorting = () => {
    this.#activeSorting = SortByPrice.INCREASE;
  };

  initalize = () => {
    this.#renderCatalog();
    this.#renderCatalogContainer();

    if (this.#isLoading) {
      this.#renderCatalogLoadingMessage();
      return;
    }

    this.#renderCatalogSortings();
    this.#renderCatalogProductsContainer();
    this.#renderCatalogProducts();

    if (this.products.length > this.#productsToRender) {
      this.#renderCatalogButtons();
      this.#setCatalogButtonsHandlers();
    }
  };
}
