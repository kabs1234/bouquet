import { remove, render, RenderPosition, replace } from '../framework/render';
import BasketWrapperView from '../views/basket-views/basket-wrapper-view';
import BasketHeroView from '../views/basket-views/basket-hero-view';
import BasketView from '../views/basket-views/basket-view';
import BasketContentContainerView from '../views/basket-views/basket-content-container';
import BasketCatalogDirectorView from '../views/basket-views/basket-catalog-director-view';
import BasketProductsContainerView from '../views/basket-views/basket-products-container-view';
import BasketProductView from '../views/basket-views/basket-product-view';
import BasketClearProductsButtonView from '../views/basket-views/basket-clear-products-view';
import BasketSumView from '../views/basket-views/basket-sum-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import { MIN_BLOCK_TIME, TIME_BEFORE_BLOCK, UpdateType } from '../constants';
import BasketEmptyMessageView from '../views/basket-views/basket-empty-message-view';
import BasketLoadingMessageView from '../views/basket-views/basket-loading-message-view';

export default class BasketPresenter extends UiBlocker {
  #productsModel = null;
  #container = null;
  #isLoading = true;

  #basketView = new BasketView();
  #basketWrapper = new BasketWrapperView();
  #basketContentContainerView = new BasketContentContainerView();
  #basketEmptyMessageView = new BasketEmptyMessageView();
  #basketLoadingMessageView = new BasketLoadingMessageView();

  #basketHeroView = null;
  #basketCatalogDirectorView = null;
  #basketClearProductsButtonView = null;
  #basketProductsContainerView = null;
  #basketSumView = null;
  #renderPosition = null;
  #directToCatalogButtonClickHandler = null;
  #handleBasketCloseButtonClick = null;

  #basketProductsViews = new Map();

  constructor(container, productsModel, directToCatalogButtonClickHandler, basketCloseButtonHandler, renderPosition = RenderPosition.BEFOREEND) {
    super(TIME_BEFORE_BLOCK, MIN_BLOCK_TIME);

    this.#container = container;
    this.#productsModel = productsModel;
    this.#directToCatalogButtonClickHandler = directToCatalogButtonClickHandler;
    this.#handleBasketCloseButtonClick = basketCloseButtonHandler;
    this.#renderPosition = renderPosition;

    productsModel.addObserver(this.#handleBasketChange);
  }

  get basketProducts() {
    return this.#productsModel.basket.products;
  }

  get products() {
    return this.#productsModel.products;
  }

  #renderBasket = () => {
    render(this.#basketView, this.#container, this.#renderPosition);
  };

  #renderBasketWrapper = () => {
    render(this.#basketWrapper, this.#basketView.element);
  };

  #renderBasketHero = () => {
    const previousBasketHeroView = this.#basketHeroView;

    this.#basketHeroView = new BasketHeroView(this.#isLoading);
    this.#basketHeroView.setBasketCloseButtonClickHandler(this.#handleBasketCloseButtonClick);

    if (previousBasketHeroView === null) {
      render(this.#basketHeroView, this.#basketWrapper.element);
      return;
    }

    replace(this.#basketHeroView, previousBasketHeroView);
    remove(previousBasketHeroView);
  };

  #renderBasketContentContainer = () => {
    render(this.#basketContentContainerView, this.#basketWrapper.element);
  };

  #renderCatalogDirectorView = () => {
    const previousBasketCatalogDirectorView = this.#basketCatalogDirectorView;

    this.#basketCatalogDirectorView = new BasketCatalogDirectorView();
    this.#basketCatalogDirectorView.setDirectToCatalogButtonClickHandler(this.#handleDirectToCatalogButtonClick);

    if (previousBasketCatalogDirectorView === null) {
      render(this.#basketCatalogDirectorView, this.#basketContentContainerView.element);
      return;
    }

    replace(this.#basketCatalogDirectorView, previousBasketCatalogDirectorView);
    remove(previousBasketCatalogDirectorView);
  };

  #renderBasketProductsContainerView = () => {
    const previousBasketProductsContainerView = this.#basketProductsContainerView;

    this.#basketProductsContainerView = new BasketProductsContainerView();

    if (previousBasketProductsContainerView === null) {
      render(this.#basketProductsContainerView, this.#basketContentContainerView.element);
      return;
    }

    replace(this.#basketProductsContainerView, previousBasketProductsContainerView);
    remove(previousBasketProductsContainerView);
  };

  #renderBasketProducts = () => {
    if (Object.keys(this.basketProducts).length === 0) {
      return;
    }

    const basketProductsId = Object.keys(this.basketProducts);
    const basketProductsData = this.products.filter((product) => basketProductsId.includes(product.id));

    basketProductsData.map((element) => {
      const basketProductQuantity = this.basketProducts[element.id];
      const basketProduct = new BasketProductView({...element, isDeleting: false}, basketProductQuantity);
      this.#basketProductsViews.set(element.id, basketProduct);

      basketProduct.setDeleteProductButtonClickHandler(this.#handleDeleteProductButtonClick);
      basketProduct.setIncreaseQuantityButtonClickHandler(this.#handleIncreaseQuantityButtonClick);
      basketProduct.setDecreaseQuantityButtonClickHandler(this.#handleDecreaseQuantityButtonClick);

      render(basketProduct, this.#basketProductsContainerView.element);
    });
  };

  #renderBasketClearProductsButton = () => {
    const previousBasketClearProductsButtonView = this.#basketClearProductsButtonView;

    this.#basketClearProductsButtonView = new BasketClearProductsButtonView({isClearing: false});
    this.#basketClearProductsButtonView.setBasketClearButtonClickHandler(this.#handleBasketClearButtonClick);

    if (previousBasketClearProductsButtonView === null) {
      render(this.#basketClearProductsButtonView, this.#basketContentContainerView.element);
      return;
    }

    replace(this.#basketClearProductsButtonView, previousBasketClearProductsButtonView);
    remove(previousBasketClearProductsButtonView);
  };

  #renderBasketSum = () => {
    const previousBasketSumView = this.#basketSumView;
    this.#basketSumView = new BasketSumView(this.#productsModel.basket);

    if (previousBasketSumView === null) {
      render(this.#basketSumView, this.#basketContentContainerView.element);
      return;
    }

    replace(this.#basketSumView, previousBasketSumView);
    remove(previousBasketSumView);
  };

  #renderBasketLoadingMessage = () => {
    render(this.#basketLoadingMessageView, this.#basketProductsContainerView.element);
  };

  #renderBasketEmptyMessage = () => {
    render(this.#basketEmptyMessageView, this.#basketProductsContainerView.element);
  };

  #handleBasketChange = (updateType, productId) => {
    switch (updateType) {
      case UpdateType.INITIALIZE:
        this.#isLoading = false;
        remove(this.#basketLoadingMessageView);
        this.initalize();

        if (Object.keys(this.basketProducts).length === 0) {
          this.#renderBasketEmptyMessage();
        }

        break;
      case UpdateType.MAJOR:
        this.#renderBasketProductsContainerView();

        if (Object.keys(this.basketProducts).length === 0) {
          this.#renderBasketEmptyMessage();
        }

        this.#renderBasketProducts();
        this.#renderBasketSum();
        this.#basketClearProductsButtonView.updateElement({isClearing: false});
        break;
      case UpdateType.CHANGING_PRODUCT_ERROR: {
        const basketProductView = this.#basketProductsViews.get(productId);
        const basketProductData = this.products.find((product) => product.id === productId);
        basketProductView.updateElement({...basketProductData, isDeleting: false});
        basketProductView.shake();
        break;
      }
      case UpdateType.CLEARING_BASKET_ERROR:
        this.#basketClearProductsButtonView.updateElement({isClearing: false});
        this.#basketClearProductsButtonView.shake();
        break;
    }

    this.unblock();
  };

  #handleIncreaseQuantityButtonClick = (productId) => {
    this.block();
    this.#productsModel.incrementProductQuantity(productId);
  };

  #handleDeleteProductButtonClick = (productId) => {
    this.block();

    const basketProductData = this.products.find((product) => product.id === productId);
    const basketProductView = this.#basketProductsViews.get(productId);

    basketProductView.updateElement({...basketProductData, isDeleting: true});
    this.#productsModel.deleteProductFromBasket(productId);
  };

  #handleDecreaseQuantityButtonClick = (productId) => {
    const basketProductQuantity = this.basketProducts[productId];

    if (basketProductQuantity === 1) {
      return;
    }

    this.block();
    this.#productsModel.decrementProductQuantity(productId);
  };

  #handleDirectToCatalogButtonClick = () => {
    this.#handleBasketCloseButtonClick();
    this.#directToCatalogButtonClickHandler();
  };

  #handleBasketClearButtonClick = () => {
    if (Object.keys(this.basketProducts).length === 0) {
      return;
    }

    this.block();
    this.#basketClearProductsButtonView.updateElement({isClearing: true});
    this.#productsModel.clearBasket();
  };

  initalize = () => {
    this.#renderBasket();
    this.#renderBasketWrapper();

    this.#renderBasketHero();
    this.#renderBasketContentContainer();

    this.#renderCatalogDirectorView();

    this.#renderBasketProductsContainerView();
    this.#renderBasketProducts();

    if (this.#isLoading) {
      this.#renderBasketLoadingMessage();
    }

    this.#renderBasketClearProductsButton();
    this.#renderBasketSum();
  };

}
