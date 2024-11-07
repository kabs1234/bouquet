import AbstractView from '../framework/view/abstract-view.js';

const createCatalogContainerTemplate = () => '<ul class="catalogue__list"></ul>';

export default class CatalogContainerView extends AbstractView {
  get template() {
    return createCatalogContainerTemplate();
  }
}
