import Observable from "../framework/observable.js";
import { BASKET } from "../mocks/basket.js";
import { PRODUCTS } from "../mocks/products.js";

export default class ProductsModel extends Observable {
  get products() {
    return [...PRODUCTS];
  }

  get basket() {
    return {...BASKET};
  }
}
