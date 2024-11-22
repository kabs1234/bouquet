import AbstractView from '../framework/view/abstract-view.js';

const createExpandedProductLoadingErrorMessageTemplate = () => (`
  <p class="product-description__error-message" style="font-size: 70px; line-height: 1;">Не удалось загрузить данные о букете, попробуйте еще раз!</p>
`);

export default class ExpandedProductLoadingErrorMessageView extends AbstractView {
  get template() {
    return createExpandedProductLoadingErrorMessageTemplate();
  }
}
