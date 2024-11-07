import { remove, render } from '../framework/render';
import CatalogButtonsView from '../views/catalog-buttons-view';
import CatalogContainerView from '../views/catalog-container-view';
import CatalogHeaderView from '../views/catalog-header-view';
import CatalogItemView from '../views/catalog-item-view';

const PRODUCTS_RENDERING_AMOUNT_STEP = 6;

export default class CatalogPresenter {
  #container = null;
  #productsModel = null;
  #catalogHeaderView = new CatalogHeaderView();
  #catalogButtonsView = new CatalogButtonsView();
  #catalogContainerView = new CatalogContainerView();
  #showedProductsAmount = 0;
  #productsToRender = this.#showedProductsAmount + PRODUCTS_RENDERING_AMOUNT_STEP;
  #productsCopy = null;

  constructor(container, productsModel) {
    this.#container = container;
    this.#productsModel = productsModel;
    this.#productsCopy = this.#productsModel.products;
  }

  #renderCatalogButtons = () => {
    render(this.#catalogButtonsView, this.#container);
  };

  #renderCatalogHeader = () => {
    render(this.#catalogHeaderView, this.#container);
  };

  #renderCatalogItems = () => {
    this.#productsCopy.slice(this.#showedProductsAmount, this.#productsToRender).forEach((product) => {
      this.#renderCatalogItem(product);
    });

    if (this.#productsCopy.length < this.#productsToRender) {
      remove(this.#catalogButtonsView);
      this.#catalogButtonsView = null;
    }
  };

  #renderCatalogItem = (product) => {
    const catalogItem = new CatalogItemView(product);

    render(catalogItem, this.#catalogContainerView.element);
  };

  #renderMoreProducts = () => {
    this.#showedProductsAmount += PRODUCTS_RENDERING_AMOUNT_STEP;
    this.#productsToRender += PRODUCTS_RENDERING_AMOUNT_STEP;

    this.#renderCatalogItems();
  };

  #setHandlers = () => {
    this.#catalogButtonsView.setShowMoreButtonClickHandler(this.#renderMoreProducts);
  };

  #renderCatalogList = () => {
    render(this.#catalogContainerView, this.#container);
  };

  initalize = () => {
    this.#renderCatalogHeader();
    this.#renderCatalogList();
    this.#renderCatalogItems();

    if (this.#productsCopy.length > this.#productsToRender) {
      this.#renderCatalogButtons();
    }

    this.#setHandlers();
  };
}
