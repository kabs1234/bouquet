import { render } from '../framework/render.js';
import CatalogButtonsView from '../views/catalog-buttons-view.js';
import CatalogProductsContainerView from '../views/catalog-products-container-view.js';
import CatalogHeaderView from '../views/catalog-header-view.js';
import CatalogProductView from '../views/catalog-product-view.js';
import CatalogView from '../views/catalog-container-view.js';

const PRODUCTS_RENDERING_AMOUNT_STEP = 6;

export default class CatalogPresenter {
  #container = null;
  #productsModel = null;
  #catalogView = new CatalogView();
  #catalogContainer = this.#catalogView.element.firstElementChild;
  #catalogHeaderView = new CatalogHeaderView();
  #catalogButtonsView = new CatalogButtonsView();
  #catalogProductsContainerView = new CatalogProductsContainerView();
  #showedProductsAmount = 0;
  #productsToRender = this.#showedProductsAmount + PRODUCTS_RENDERING_AMOUNT_STEP;
  #productsCopy = null;

  constructor(container, productsModel) {
    this.#container = container;
    this.#productsModel = productsModel;
    this.#productsCopy = this.#productsModel.products;
  }

  #renderCatalogButtons = () => {
    render(this.#catalogButtonsView, this.#catalogContainer);
  };

  #renderCatalogHeader = () => {
    render(this.#catalogHeaderView, this.#catalogContainer);
  };

  #renderCatalogProducts = () => {
    this.#productsCopy.slice(this.#showedProductsAmount, this.#productsToRender).forEach((product) => {
      this.#renderCatalogProduct(product);
    });

    if (this.#productsCopy.length < this.#productsToRender) {
      this.#catalogButtonsView.removeShowMoreButton();
    }
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
  };

  #setHandlers = () => {
    this.#catalogButtonsView.setShowMoreButtonClickHandler(this.#renderMoreProducts);
    this.#catalogButtonsView.setToTopButtonClickHandler(this.#swipeToCatalogTop);
  };

  #renderCatalogProductsContainer = () => {
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

    if (this.#productsCopy.length > this.#productsToRender) {
      this.#renderCatalogButtons();
    }

    this.#setHandlers();
  };
}
