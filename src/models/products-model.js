import { UpdateType } from '../constants.js';
import Observable from '../framework/observable.js';
import ClosingExpandedProductError from '../utils/closing-expanded-product-error.js';

export default class ProductsModel extends Observable {
  #productService = null;
  #productsList = [];
  #basket = {
    'products': {},
    'productCount': 0,
    'sum': 0
  };

  constructor(productService) {
    super();
    this.#productService = productService;
  }

  get products() {
    return this.#productsList;
  }

  get basket() {
    return this.#basket;
  }

  addProductToBasket = async (productId) => {
    try {
      await this.#productService.addOrIncrementProduct(productId);

      this.#basket = {
        ...this.#basket,
        'productCount': Object.values(this.basket.products).reduce((prev, current) => prev + current, 0) + 1,
        'sum': this.#basket.sum + this.products.find((element) => element.id === productId).price
      };

      this.#basket.products[productId] = 1;

      this._notify(UpdateType.MAJOR);
    } catch (err) {
      this._notify(UpdateType.CHANGING_PRODUCT_ERROR, productId);
      throw new Error(`An error occurred adding product to basket: ${err.message}`);
    }
  };

  incrementProductQuantity = async (productId) => {
    try {
      await this.#productService.addOrIncrementProduct(productId);

      this.#basket = {
        ...this.#basket,
        'productCount': Object.values(this.basket.products).reduce((prev, current) => prev + current, 0) + 1,
        'sum': this.#basket.sum + this.products.find((element) => element.id === productId).price
      };

      this.basket.products[productId] += 1;

      this._notify(UpdateType.MAJOR);
    } catch (err) {
      this._notify(UpdateType.CHANGING_PRODUCT_ERROR, productId);
      throw new Error(`An error occurred incrementing product quantity: ${err.message, err.stack}`);
    }
  };

  deleteProductFromBasket = async (productId) => {
    try {
      while (this.basket.products[productId]) {
        await this.decreaseQuantityOrDeleteProduct(productId);
      }

      this._notify(UpdateType.MAJOR);
    } catch (err) {
      this._notify(UpdateType.CHANGING_PRODUCT_ERROR, productId);
      throw new Error(`An error occurred deleting product from basket: ${err.message}`);
    }
  };

  decreaseQuantityOrDeleteProduct = async (productId) => {
    await this.#productService.deleteOrDecrementProduct(productId);

    this.#basket = {
      ...this.#basket,
      'productCount': Object.values(this.basket.products).reduce((prev, current) => prev + current, 0) - 1,
      'sum': this.#basket.sum - this.products.find((element) => element.id === productId).price
    };

    if (this.basket.products[productId] === 1) {
      delete this.basket.products[productId];
    } else {
      this.basket.products[productId] -= 1;
    }
  };

  decrementProductQuantity = async (productId) => {
    try {
      await this.decreaseQuantityOrDeleteProduct(productId);

      this._notify(UpdateType.MAJOR);
    } catch (err) {
      this._notify(UpdateType.CHANGING_PRODUCT_ERROR, productId);
      throw new Error(`An error occurred decrementing product quantity: ${err.message}`);
    }
  };

  clearBasket = async () => {
    try {
      const productsId = Object.keys(this.basket.products);

      await Promise.all(
        productsId.map(async (productId) => {
          while (this.basket.products[productId]) {
            await this.decreaseQuantityOrDeleteProduct(productId);
          }
        })
      );

      this._notify(UpdateType.MAJOR);
    } catch (err) {
      this._notify(UpdateType.CLEARING_BASKET_ERROR);
      throw new Error('An error occurred clearing basket');
    }
  };

  getExpandedProduct = async (productId) => {
    try {
      const expandedProductRequest = await this.#productService.getExpandedProductInformation(productId);
      return expandedProductRequest;
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new ClosingExpandedProductError(`An error occurred closing expanded product before it's initalizing: ${err.name}`);
      } else {
        throw new Error(`An error occurred getting expanded product: ${err.name, err.message}`);
      }
    }
  };

  initalize = async () => {
    try {
      const productsListRequest = await this.#productService.getProductsList();
      const basketRequest = await this.#productService.getBasket();

      this.#productsList = [...productsListRequest];
      this.#basket = Object.keys(basketRequest).length !== 0 ? {...basketRequest} : this.#basket;

      this._notify(UpdateType.INITIALIZE);
    } catch (err) {
      this._notify(UpdateType.LOADING_ERROR);
      throw new Error(`An error occurred in initalizing data: ${err.message, err.stack}`);
    }
  };
}
