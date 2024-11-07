import AbstractView from '../framework/view/abstract-view.js';

const createCatalogProductsContainerTemplate = () => '<ul class="catalogue__list"></ul>';

export default class CatalogProductsContainerView extends AbstractView {
  get template() {
    return createCatalogProductsContainerTemplate();
  }
}
