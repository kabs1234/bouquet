import AbstractView from '../../framework/view/abstract-view';

const createBasketLoadingMessageTemplate = () => (`
  <p class="popup-deferred__loading-message" style="font-size: 70px; line-height: 1;">Корзина загружается...</p>
`);

export default class BasketLoadingMessageView extends AbstractView {
  get template() {
    return createBasketLoadingMessageTemplate();
  }
}
