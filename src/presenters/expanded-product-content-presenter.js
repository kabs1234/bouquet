import { MIN_BLOCK_TIME, TIME_BEFORE_BLOCK } from '../constants';
import { render, replace } from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import ClosingExpandedProductError from '../utils/closing-expanded-product-error';
import ExpandedProductDescriptionView from '../views/expanded-product-description-view';
import ExpandedProductLoadingErrorMessageView from '../views/expanded-product-loading-error-view';
import ExpandedProductSliderView from '../views/expanded-product-slider-view';

export default class ExpandedProductContentPresenter extends UiBlocker {
  #productId = null;
  #productsModel = null;
  #container = null;

  #expandedProductSliderView = null;
  #expandedProductDescriptionView = null;

  #expandedProductLoadingErrorMessageView = new ExpandedProductLoadingErrorMessageView();

  #productData = null;

  constructor(productId, productsModel, container) {
    super(TIME_BEFORE_BLOCK, MIN_BLOCK_TIME);
    this.#productId = productId;
    this.#productsModel = productsModel;
    this.#container = container;
  }

  renderExpandedProduct = async () => {
    try {
      this.#productData = await this.#productsModel.getExpandedProduct(this.#productId);

      this.#expandedProductDescriptionView = new ExpandedProductDescriptionView(this.#productData, this.#productsModel.basket.products);
      this.#expandedProductDescriptionView.setFavoriteButtonClickHandler(this.#handleFavoriteButtonClick);

      this.#expandedProductSliderView = new ExpandedProductSliderView(this.#productData);

      render(this.#expandedProductSliderView, this.#container);
      render(this.#expandedProductDescriptionView, this.#container);
    } catch (err) {
      if (err instanceof ClosingExpandedProductError) {
        throw new ClosingExpandedProductError('Request has been canceled');
      } else {
        this.#renderExpandedProductLoadingErrorMessage();
      }
    }
  };

  #renderExpandedProductLoadingErrorMessage = () => {
    render(this.#expandedProductLoadingErrorMessageView, this.#container);
  };

  #handleFavoriteButtonClick = async () => {
    const productsId = Object.keys(this.#productsModel.basket.products);
    const isFavorite = productsId.includes(this.#productId);

    this.block();

    try {
      if (isFavorite) {
        await this.#productsModel.deleteProductFromBasket(this.#productData.id);
      } else {
        await this.#productsModel.addProductToBasket(this.#productData.id);
      }

      const newExpandedProductDescriptionView = new ExpandedProductDescriptionView(this.#productData, this.#productsModel.basket.products);
      newExpandedProductDescriptionView.setFavoriteButtonClickHandler(this.#handleFavoriteButtonClick);

      replace(newExpandedProductDescriptionView, this.#expandedProductDescriptionView);
      this.#expandedProductDescriptionView = newExpandedProductDescriptionView;
    } catch (err) {
      this.#expandedProductDescriptionView.shake();
    } finally {
      this.unblock();
    }
  };
}
