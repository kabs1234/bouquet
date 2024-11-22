import AbstractView from '../../framework/view/abstract-view.js';

const createCatalogLoadingErrorMessageTemplate = () => (`
  <p class="catalogue__error-message" style="font-size: 70px; line-height: 1;">Не удалось загрузить данные, попробуйте обновить страницу!</p>
`);

export default class CatalogLoadingErrorMessageView extends AbstractView {
  get template() {
    return createCatalogLoadingErrorMessageTemplate();
  }
}
