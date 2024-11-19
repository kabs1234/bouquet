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

  #activeSorting = SortByPrice.Increase;

  #showedProductsAmount = 0;
  #productsToRender = this.#showedProductsAmount + PRODUCTS_RENDERING_AMOUNT_STEP;
  #productsView = new Map();

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
    this.#handleViewChange(UpdateType.Major);
  };

  #setSortingByPriceToDecreasing = () => {
    this.#activeSorting = SortByPrice.Decrease;
    this.#handleViewChange(UpdateType.Major);
  };

  #handleViewChange = (updateType, productId) => {
    switch (updateType) {
      case UpdateType.Initalize:
        this.#isLoading = false;
        remove(this.#catalogLoadingMessageView);
        this.#catalogLoadingMessageView = null;

        this.initalize();
        break;
      case UpdateType.Patch: {
        const newCatalogProduct = this.products.find((product) => product.id === productId);
        const newCatalogProductView = new CatalogProductView(newCatalogProduct, this.#productsModel.basket);

        newCatalogProductView.setProductClickHandler(this.#renderExpandedProductFunction);
        newCatalogProductView.setFavoriteButtonClickHandler(this.#changeFavoriteButtonState);

        replace(newCatalogProductView, this.#productsView.get(productId));

        this.#productsView.delete(productId);
        this.#productsView.set(productId, newCatalogProductView);
        break;
      }
      case UpdateType.Major:
        this.#resetCatalogProductsList();
    }
  };

  #resetCatalogProductsList = () => {
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
    const catalogProductView = new CatalogProductView(product, this.#productsModel.basket);
    this.#productsView.set(product.id, catalogProductView);

    catalogProductView.setProductClickHandler(this.#renderExpandedProductFunction);
    catalogProductView.setFavoriteButtonClickHandler(this.#changeFavoriteButtonState);

    render(catalogProductView, this.#catalogProductsContainerView.element);
  };

  #changeFavoriteButtonState = (productId) => {
    const productsId = Object.keys(this.#productsModel.basket.products);
    const isFavorite = productsId.includes(productId);

    if (isFavorite) {
      this.#productsModel.deleteProductFromBasket(productId);
    } else {
      this.#productsModel.addProductToBasket(productId);
    }
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

  #renderCatalogLoadingMessage = () => {
    render(this.#catalogLoadingMessageView, this.#catalogContainerView.element);
  };

  resetActiveSorting = () => {
    this.#activeSorting = SortByPrice.Increase;
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
      this.#setHandlers();
    }
  };
}
