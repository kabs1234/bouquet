import AbstractView from '../../framework/view/abstract-view';

const createBasketEmptyMessageTemplate = () => (`
  <p class="popup-deferred__empty-message" style="font-size: 70px; line-height: 1;">Корзина пуста, добавьте букеты чтобы увидеть их здесь!:)</p>
`);

export default class BasketEmptyMessageView extends AbstractView {
  get template() {
    return createBasketEmptyMessageTemplate();
  }
}
