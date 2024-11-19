import { render, replace } from '../framework/render';
import ExpandedProductDescriptionView from '../views/expanded-product-description-view';
import ExpandedProductSliderView from '../views/expanded-product-slider-view';

export default class ExpandedProductContentPresenter {
  #productData = null;
  #productsModel = null;
  #container = null;

  #expandedProductSliderView = null;
  #expandedProductDescriptionView = null;

  constructor(productData, productsModel, container) {
    this.#productData = productData;
    this.#container = container;
    this.#productsModel = productsModel;
  }

  renderExpandedProduct = () => {
    this.#expandedProductDescriptionView = new ExpandedProductDescriptionView(this.#productData, this.#productsModel.basket.products);
    this.#expandedProductDescriptionView.setFavoriteButtonClickHandler(this.#changeFavoriteButtonState);

    this.#expandedProductSliderView = new ExpandedProductSliderView(this.#productData);

    render(this.#expandedProductSliderView, this.#container);
    render(this.#expandedProductDescriptionView, this.#container);
  };

  #changeFavoriteButtonState = async () => {
    const productsId = Object.keys(this.#productsModel.basket.products);
    const isFavorite = productsId.includes(this.#productData.id);

    if (isFavorite) {
      await this.#productsModel.deleteProductFromBasket(this.#productData.id);
    } else {
      await this.#productsModel.addProductToBasket(this.#productData.id);
    }

    const newExpandedProductDescriptionView = new ExpandedProductDescriptionView(this.#productData, this.#productsModel.basket.products);
    newExpandedProductDescriptionView.setFavoriteButtonClickHandler(this.#changeFavoriteButtonState);

    replace(newExpandedProductDescriptionView, this.#expandedProductDescriptionView);

    this.#expandedProductDescriptionView = newExpandedProductDescriptionView;
  };
}
