import AbstractView from '../../framework/view/abstract-view';

const createBasketContentContainerTemplate = () => '<div class="popup-deferred__container"></div>';

export default class BasketContentContainerView extends AbstractView {
  get template() {
    return createBasketContentContainerTemplate();
  }
}
