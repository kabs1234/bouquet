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
  #hideMainFunction = null;
  #showMainFunction = null;
  #basketView = new BasketView();
  #basketWrapper = new BasketWrapperView();
  #basketHeroView = new BasketHeroView();
  #basketContentContainerView = new BasketContentContainerView();
  #basketCatalogDirectorView = new BasketCatalogDirectorView();
  #basketProductsContainerView = new BasketProductsContainerView();
  #basketClearProductsButtonView = new BasketClearProductsButtonView();
  #basketSumView = null;

  constructor(container, productsModel, swipeToCatalogFunction, hideMainFunction, showMainFunction) {
    this.#container = container;
    this.#productsModel = productsModel;
    this.#swipeToCatalogFunction = swipeToCatalogFunction;
    this.#hideMainFunction = hideMainFunction;
    this.#showMainFunction = showMainFunction;
  }

  #renderBasket = () => {
    render(this.#basketView, this.#container);
  };

  #renderBasketWrapper = () => {
    render(this.#basketWrapper, this.#basketView.element);
  };

  #renderBasketHero = () => {
    render(this.#basketHeroView, this.#basketWrapper.element);
  };

  #renderBasketContentContainer = () => {
    render(this.#basketContentContainerView, this.#basketWrapper.element);
  };

  #renderCatalogDirectorView = () => {
    render(this.#basketCatalogDirectorView, this.#basketContentContainerView.element);
  };

  #renderBasketProductsContainerView = () => {
    render(this.#basketProductsContainerView, this.#basketContentContainerView.element);
  };

  #renderBasketProducts = () => {
    const basketProductsId = Object.keys(this.#productsModel.basket.products);
    const basketProductsQuantity = Object.values(this.#productsModel.basket.products);
    const basketProductsData = this.#productsModel.products.filter((product) => basketProductsId.includes(product.id));

    basketProductsData.map((element, index) => {
      const basketProductQuantity = basketProductsQuantity[index];
      const basketProduct = new BasketProductView(element, basketProductQuantity);

      render(basketProduct, this.#basketProductsContainerView.element);
    });
  };

  #renderBasketClearProductsButton = () => {
    render(this.#basketClearProductsButtonView, this.#basketContentContainerView.element);
  };

  #renderBasketSum = () => {
    this.#basketSumView = new BasketSumView(this.#productsModel.basket);

    render(this.#basketSumView, this.#basketContentContainerView.element);
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
    this.#showMainFunction();
    this.#swipeToCatalogFunction();
  };

  #clearProductsBasket = () => {
    this.#basketView.clearBasketProductsContainer();
  };

  #closeBasket = () => {
    remove(this.#basketView);
    this.#basketView = null;
    this.#showMainFunction();
  };
}
