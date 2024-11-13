import AbstractView from '../../framework/view/abstract-view.js';

const createCatalogContainerTemplate = () => (`
  <div class="catalogue" data-items="catalogue"></div>
`);

export default class CatalogContainerView extends AbstractView {
  get template() {
    return createCatalogContainerTemplate();
  }
}
