import { render } from '../framework/render';
import ExpandedProductDescriptionView from '../views/expanded-product-description-view';
import ExpandedProductSliderView from '../views/expanded-product-slider';

export default class ExpandedProductContentPresenter {
  #productData = null;
  #container = null;
  #expandedProductSliderView = null;
  #expandedProductDescriptionView = null;

  constructor(productData, container) {
    this.#productData = productData;
    this.#container = container;
  }

  renderExpandedProduct = () => {
    this.#expandedProductDescriptionView = new ExpandedProductDescriptionView(this.#productData);
    this.#expandedProductSliderView = new ExpandedProductSliderView(this.#productData);

    render(this.#expandedProductSliderView, this.#container);
    render(this.#expandedProductDescriptionView, this.#container);
  };
}
