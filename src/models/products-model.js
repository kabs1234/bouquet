import { UpdateType } from '../constants.js';
import Observable from '../framework/observable.js';

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
      await this.#productService.addProductToBasket(productId);

      this.#basket = {
        ...this.#basket,
        'productCount': Object.values(this.basket.products).reduce((prev, current) => prev + current, 0) + 1,
        'sum': this.#basket.sum + this.products.find((element) => element.id === productId).price
      };

      this.#basket.products[productId] = 1;

      this._notify(UpdateType.Major);
    } catch (err) {
      throw new Error(`An error occurred adding product to basket: ${err.message}`);
    }
  };

  deleteProductFromBasket = async (productId) => {
    try {
      await this.deleteProduct(productId);

      this._notify(UpdateType.Major);
    } catch (err) {
      throw new Error(`An error occurred deleting product in basket: ${err.message}`);
    }
  };

  incrementProductQuantity = async (productId) => {
    try {
      await this.#productService.addProductToBasket(productId);

      this.#basket = {
        ...this.#basket,
        'productCount': Object.values(this.basket.products).reduce((prev, current) => prev + current, 0) + 1,
        'sum': this.#basket.sum + this.products.find((element) => element.id === productId).price
      };

      this.basket.products[productId] += 1;

      this._notify(UpdateType.Major);
    } catch (err) {
      throw new Error(`An error occurred incrementing product quantity: ${err.message, err.stack}`);
    }
  };

  deleteProduct = async (productId) => {
    while (this.basket.products[productId]) {
      await this.decreaseQuantityOrDeleteProduct(productId);
    }
  };

  decreaseQuantityOrDeleteProduct = async (productId) => {
    await this.#productService.deleteProductFromBasket(productId);

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

      this._notify(UpdateType.Major);
    } catch (err) {
      throw new Error(`An error occurred decrementing product quantity: ${err.message}`);
    }
  };

  clearBasket = async () => {
    const productsId = Object.keys(this.basket.products);

    await Promise.all(
      productsId.map(async (productId) => await this.deleteProduct(productId))
    );

    this._notify(UpdateType.Major);
  };


  getExpandedProduct = async (productId) => {
    try {
      const expandedProductRequest = await this.#productService.getExpandedProductInformation(productId);

      return expandedProductRequest;
    } catch (err) {
      throw new Error(`An error occurred getting expanded product: ${err.message, err.stack}`);
    }
  };

  initalize = async () => {
    try {
      const productsListRequest = await this.#productService.getProductsList();
      const basketRequest = await this.#productService.getBasket();

      this.#productsList = [...productsListRequest];
      this.#basket = Object.keys(basketRequest).length !== 0 ? {...basketRequest} : this.#basket;

      this._notify(UpdateType.Initalize);
    } catch (err) {
      throw new Error(`An error occurred in initalizing data: ${err.message}`);
    }
  };
}
