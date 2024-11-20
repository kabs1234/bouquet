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
import { MIN_BLOCK_TIME, TIME_BEFORE_BLOCK } from '../constants';

export default class BasketPresenter extends UiBlocker {
  #productsModel = null;
  #container = null;

  #basketView = new BasketView();
  #basketWrapper = new BasketWrapperView();
  #basketHeroView = new BasketHeroView();
  #basketContentContainerView = new BasketContentContainerView();
  #basketCatalogDirectorView = new BasketCatalogDirectorView();
  #basketClearProductsButtonView = new BasketClearProductsButtonView({isClearing: false});

  #basketProductsContainerView = null;
  #basketSumView = null;
  #renderPosition = null;
  #redirectToCatalogFunction = null;
  #showMain = null;

  constructor(container, productsModel, redirectToCatalogFunction, showMain, renderPosition = RenderPosition.BEFOREEND) {
    super(TIME_BEFORE_BLOCK, MIN_BLOCK_TIME);

    this.#container = container;
    this.#productsModel = productsModel;
    this.#redirectToCatalogFunction = redirectToCatalogFunction;
    this.#showMain = showMain;
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
      const basketProduct = new BasketProductView({...element, isDeleting: false}, basketProductQuantity);

      basketProduct.setDeleteProductButtonClickHandler((productId) => {
        this.block();
        basketProduct.updateElement({...element, isDeleting: true});
        this.#productsModel.deleteProductFromBasket(productId).catch(() => {
          basketProduct.updateElement({...element, isDeleting: false});
        });
      });

      basketProduct.setIncreaseQuantityButtonClickHandler((productId) => {
        this.block();
        this.#productsModel.incrementProductQuantity(productId);
      });

      basketProduct.setDecreaseQuantityButtonClickHandler((productId) => {
        this.block();
        this.#productsModel.decrementProductQuantity(productId);
      });

      render(basketProduct, this.#basketProductsContainerView.element);
    });
  };

  #handleBasketChange = () => {
    this.unblock();

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
    if (Object.keys(this.basketProducts).length === 0) {
      return;
    }

    this.block();

    this.#basketClearProductsButtonView.updateElement({isClearing: true});

    this.#productsModel.clearBasket()
      .then(() => {
        this.#basketClearProductsButtonView.updateElement({isClearing: false});
      })
      .catch(() => {
        this.#basketClearProductsButtonView.updateElement({isClearing: false});
        this.#basketClearProductsButtonView.shake();
      });
  };

  #removeBasket = () => {
    remove(this.#basketView);
    this.#basketView = null;
    this.#showMain();
  };
}
