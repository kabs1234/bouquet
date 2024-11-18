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

export default class BasketPresenter {
  #productsModel = null;
  #container = null;

  #basketView = new BasketView();
  #basketWrapper = new BasketWrapperView();
  #basketHeroView = new BasketHeroView();
  #basketContentContainerView = new BasketContentContainerView();
  #basketCatalogDirectorView = new BasketCatalogDirectorView();
  #basketClearProductsButtonView = new BasketClearProductsButtonView();

  #basketProductsContainerView = null;
  #basketSumView = null;
  #renderPosition = null;
  #redirectToCatalogFunction = null;

  constructor(container, productsModel, redirectToCatalogFunction, renderPosition = RenderPosition.BEFOREEND) {
    this.#container = container;
    this.#productsModel = productsModel;
    this.#redirectToCatalogFunction = redirectToCatalogFunction;
    this.#renderPosition = renderPosition;

    productsModel.addObserver(this.#handleBasketChange);
  }

  get basketProducts() {
    return this.#productsModel.basket.products;
  }

  #renderBasket = () => {
    render(this.#basketView, this.#container, this.#renderPosition);
  };

  #renderBasketWrapper = () => {
    render(this.#basketWrapper, this.#basketView.element);
  };

  #renderBasketHero = () => {
    this.#basketHeroView.setBasketCloseButtonClickHandler(this.#removeBasket);

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
    const basketProductsId = Object.keys(this.basketProducts);
    const basketProductsData = this.#productsModel.products.filter((product) => basketProductsId.includes(product.id));

    basketProductsData.map((element) => {
      const basketProductQuantity = this.basketProducts[element.id];
      const basketProduct = new BasketProductView(element, basketProductQuantity);

      basketProduct.setDeleteProductButtonClickHandler(this.#productsModel.deleteProductFromBasket);
      basketProduct.setIncreaseQuantityButtonClickHandler(this.#productsModel.addProductToBasket);
      basketProduct.setDecreaseQuantityButtonClickHandler(this.#productsModel.deleteProductFromBasket);

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
    this.#removeBasket();
    this.#redirectToCatalogFunction();
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

  #removeBasket = () => {
    remove(this.#basketView);
    this.#basketView = null;
  };
}
