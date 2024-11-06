import { render } from "../framework/render";
import CatalogButtonsView from "../views/catalog-buttons-view";
import CatalogHeaderView from "../views/catalog-header-view";
import CatalogListView from "../views/catalog-view";

export default class CatalogPresenter {
  #container = null;
  #catalogListView = new CatalogListView();
  #catalogHeaderView = new CatalogHeaderView();
  #catalogButtonsView = new CatalogButtonsView();

  constructor(container) {
    this.#container = container;
  }

  #renderCatalogButtons = () => {
    render(this.#catalogButtonsView, this.#container)
  }

  #renderCatalogHeader = () => {
    render(this.#catalogHeaderView, this.#container)
  }

  #renderCatalogList = () => {
    render(this.#catalogListView, this.#container)
  }

  initalize = () => {
    this.#renderCatalogHeader();
    this.#renderCatalogList();
    this.#renderCatalogButtons();
  }
}
