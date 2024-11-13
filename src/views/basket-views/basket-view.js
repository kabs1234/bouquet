import AbstractView from '../../framework/view/abstract-view.js';

const createBasketTemplate = () => (`
  <section class="popup-deferred"></section>
`);

export default class BasketView extends AbstractView {
  get template() {
    return createBasketTemplate();
  }
}
