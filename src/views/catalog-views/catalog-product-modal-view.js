import AbstractView from '../../framework/view/abstract-view.js';

const createCatalogProductModalTemplate = () => (`
  <div class="image-slider"></div>

  <div class="product-description">
    <div class="product-description__header">
      <h3 class="title title--h2">Летнее настроение</h3><b class="price price--size-big">5&nbsp;800<span>Р</span></b>
    </div>
    <p class="text text--size-40">сочетание полевых и&nbsp;садовых цветов: розы, львиный зев, чертополох, тюльпаны и&nbsp;эустома</p>
    <button class="btn btn--outlined btn--full-width product-description__button" type="button" data-focus="">отложить
    </button>
  </div>
`);

export default class CatalogProductModalView extends AbstractView {
  get template() {
    return createCatalogProductModalTemplate();
  }
}
