import AbstractView from '../../framework/view/abstract-view.js';

const createBasketProductsContainerTemplate = () => '<ul class="popup-deferred__catalog"></ul>';

export default class BasketProductsContainerView extends AbstractView {
  get template() {
    return createBasketProductsContainerTemplate();
  }
}
