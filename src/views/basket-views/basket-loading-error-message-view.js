import AbstractView from '../../framework/view/abstract-view';

const createBasketLoadingErrorMessageTemplate = () => (`
  <p class="popup-deferred__error-message" style="font-size: 70px; line-height: 1;">Не удалось загрузить корзину, попробуйте обновить страницу!</p>
`);

export default class BasketLoadingErrorMessageView extends AbstractView {
  get template() {
    return createBasketLoadingErrorMessageTemplate();
  }
}
