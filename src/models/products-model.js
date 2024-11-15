import Observable from '../framework/observable.js';
import { BASKET } from '../mocks/basket.js';
import { PRODUCTS } from '../mocks/products.js';

export default class ProductsModel extends Observable {
  #productService = null;
  #productsList = [];
  #basket = null;

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

  addProductToBasket = (product) => {
    this.basket.products[product] = 1;
    console.log(this.basket, product);

    this._notify();
  };

  increaseProductQuantityByOne = (product) => {
    this.basket.products[product] += 1;

    console.log(this.basket);

    this._notify();
  };

  decreaseProductQuantityByOne = (product) => {
    this.basket.products[product] -= 1;

    console.log(this.basket);

    this._notify();
  };

  deleteProductFromBasket = (product) => {
    delete this.basket.products[product];
    console.log(this.basket, product);

    this._notify();
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
      this.#basket = {...basketRequest};

      this._notify();

    } catch (err) {
      throw new Error('error');
    }
  };
}
