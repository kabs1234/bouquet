import AbstractView from '../../framework/view/abstract-view.js';

const createCatalogLoadingMessageTemplate = () => (`
  <p class="catalogue__loading-message" style="font-size: 70px;">Загружаем...</p>
`);

export default class CatalogLoadingMessageView extends AbstractView {
  get template() {
    return createCatalogLoadingMessageTemplate();
  }
}
