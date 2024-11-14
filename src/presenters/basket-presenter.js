import { remove, render, replace } from '../framework/render';
import BasketWrapperView from '../views/basket-views/basket-wrapper-view';
import BasketHeroView from '../views/basket-views/basket-hero-view';
import BasketView from '../views/basket-views/basket-view';
import BasketContentContainerView from '../views/basket-views/basket-content-container';
import BasketCatalogDirectorView from '../views/basket-views/basket-catalog-director-view';
import BasketProductsContainerView from '../views/basket-views/basket-products-container-view';
import BasketProductView from '../views/basket-views/basket-product-view';
import BasketClearProductsButtonView from '../views/basket-views/basket-clear-products-view';
import BasketSumView from '../views/basket-views/basket-sum-view';

export default class BasketPresenter {
  #productsModel = null;
  #container = null;
  #swipeToCatalogFunction = null;
  #showMainFunction = null;
  #basketView = new BasketView();
  #basketWrapper = new BasketWrapperView();
  #basketHeroView = new BasketHeroView();
  #basketContentContainerView = new BasketContentContainerView();
  #basketCatalogDirectorView = new BasketCatalogDirectorView();
  #basketProductsContainerView = null;
  #basketClearProductsButtonView = new BasketClearProductsButtonView();
  #basketSumView = null;

  constructor(container, productsModel, swipeToCatalogFunction, showMainFunction) {
    this.#container = container;
    this.#productsModel = productsModel;
    this.#swipeToCatalogFunction = swipeToCatalogFunction;
    this.#showMainFunction = showMainFunction;

    productsModel.addObserver(this.#handleBasketChange);
  }

  #renderBasket = () => {
    render(this.#basketView, this.#container);
  };

  #renderBasketWrapper = () => {
    render(this.#basketWrapper, this.#basketView.element);
  };

  #renderBasketHero = () => {
    this.#basketHeroView.setBasketCloseButtonClickHandler(this.#closeBasket);

    render(this.#basketHeroView, this.#basketWrapper.element);
  };

  #renderBasketContentContainer = () => {
    render(this.#basketContentContainerView, this.#basketWrapper.element);
  };

  #renderCatalogDirectorView = () => {
    this.#basketCatalogDirectorView.setDirectToCatalogButtonClickHandler(this.#directToCatalog);

    render(this.#basketCatalogDirectorView, this.#basketContentContainerView.element);
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
    const basketProductsId = Object.keys(this.#productsModel.basket.products);
    const basketProductsQuantity = Object.values(this.#productsModel.basket.products);
    const basketProductsData = this.#productsModel.products.filter((product) => basketProductsId.includes(product.id));

    basketProductsData.map((element, index) => {
      const basketProductQuantity = basketProductsQuantity[index];
      const basketProduct = new BasketProductView(element, basketProductQuantity);

      basketProduct.setDeleteProductButtonClickHandler(this.#productsModel.deleteProductFromBasket);
      basketProduct.setIncreaseQuantityButtonClickHandler(this.#productsModel.increaseProductQuantityByOne);
      basketProduct.setDecreaseQuantityButtonClickHandler(this.#productsModel.decreaseProductQuantityByOne);

      render(basketProduct, this.#basketProductsContainerView.element);
    });
  };

  #handleBasketChange = () => {
    this.#renderBasketProductsContainerView();
    this.#renderBasketProducts();
    this.#renderBasketSum();
  };

  #renderBasketClearProductsButton = () => {
    this.#basketClearProductsButtonView.setBasketClearButtonClickHandler(this.#clearProductsBasket);

    render(this.#basketClearProductsButtonView, this.#basketContentContainerView.element);
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

  initalize = () => {
    this.#renderBasket();
    this.#renderBasketWrapper();

    this.#renderBasketHero();
    this.#renderBasketContentContainer();

    this.#renderCatalogDirectorView();
    this.#renderBasketProductsContainerView();
    this.#renderBasketProducts();

    this.#renderBasketClearProductsButton();
    this.#renderBasketSum();
  };

  #directToCatalog = () => {
    this.#closeBasket();
    this.#swipeToCatalogFunction();
  };

  #clearProductsBasket = () => {
    remove(this.#basketProductsContainerView);
    this.#basketProductsContainerView = null;

    remove(this.#basketClearProductsButtonView);
    this.#basketClearProductsButtonView = null;

    remove(this.#basketSumView);
    this.#basketSumView = null;

    this.#productsModel.clearBasket();
  };

  #closeBasket = () => {
    remove(this.#basketView);
    this.#basketView = null;
    this.#showMainFunction();
  };
}
