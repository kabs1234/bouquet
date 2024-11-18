import { UpdateType } from '../constants.js';
import Observable from '../framework/observable.js';
import { BASKET } from '../mocks/basket.js';
import { PRODUCTS } from '../mocks/products.js';

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

  // get products() {
  //   return [...PRODUCTS];
  // }

  // get basket() {
  //   return {...BASKET};
  // }

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
        'productCount': Object.keys(this.basket.products).length + 1,
        'sum': this.#basket.sum + this.products.find((element) => element.id === productId).price
      };

      if (Object.keys(this.basket).includes(productId)) {
        this.basket.products[productId] += 1;
      } else {
        this.#basket.products[productId] = 1;
      }

      this._notify(UpdateType.Patch, productId);
    } catch (err) {
      throw new Error(`An error occurred adding product to basket: ${err.message}`);
    }
  };

  deleteProductFromBasket = async (productId) => {
    try {
      await this.#productService.deleteProductFromBasket(productId);

      this.#basket = {
        ...this.#basket,
        'productCount': Object.keys(this.basket.products).length - 1,
        'sum': this.#basket.sum - this.products.find((element) => element.id === productId).price
      };

      if (Object.keys(this.basket).includes(productId)) {
        this.basket.products[productId] -= 1;
      } else {
        delete this.basket.products[productId];
      }

      this._notify(UpdateType.Patch, productId);
    } catch (err) {
      throw new Error(`An error occurred deleting product in basket: ${err.message}`);
    }
  };

  clearBasket = () => {
    const productsId = Object.keys(this.basket.products);

    productsId.forEach((productId) => {
      delete this.basket.products[productId];
    });

    this._notify();
  };

  initalize = async () => {
    try {
      const productsListRequest = await this.#productService.getProductsList();
      const basketRequest = await this.#productService.getBasket();

      this.#productsList = [...productsListRequest];
      this.#basket = Object.keys(basketRequest).length ? {...basketRequest} : this.#basket;

      this._notify(UpdateType.Initalize);
    } catch (err) {
      throw new Error(`An error occurred in initalizing data: ${err.message}`);
    }
  };
}
