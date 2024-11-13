import AbstractView from '../../framework/view/abstract-view';

const createBasketWrapperTemplate = () => '<div class="popup-deferred__wrapper"></div>';

export default class BasketWrapperView extends AbstractView {
  get template() {
    return createBasketWrapperTemplate();
  }
}
