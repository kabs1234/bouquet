import AbstractView from '../../framework/view/abstract-view.js';
import { beautifyPrice } from '../../utils/general.js';

const createBasketSumTemplate = (basketData) => (`
  <div class="popup-deferred__sum">
    <p class="text text--total">Итого вы выбрали:</p>
    <div class="popup-deferred__block-wrap">
      <div class="popup-deferred__block">
        <p class="text text--total">Букеты</p><span class="popup-deferred__count" data-atribut="count-defer">${basketData.productCount}</span>
      </div>
      <div class="popup-deferred__block">
        <p class="text text--total">Сумма</p><b class="price price--size-middle-p">${beautifyPrice(basketData.sum)}<span>Р</span></b>
      </div>
    </div>
  </div>
`);

export default class BasketSumView extends AbstractView {
  #basketData = null;

  constructor(basketData) {
    super();
    this.#basketData = basketData;
  }

  get template() {
    return createBasketSumTemplate(this.#basketData);
  }
}
