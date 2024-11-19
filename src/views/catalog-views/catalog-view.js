import AbstractView from '../../framework/view/abstract-view.js';

const createCatalogTemplate = () => (`
  <div class="catalogue" data-items="catalogue" id='catalogue'></div>
`);

export default class CatalogView extends AbstractView {
  get template() {
    return createCatalogTemplate();
  }
}
