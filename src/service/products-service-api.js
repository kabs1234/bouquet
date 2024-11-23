import { Method } from '../constants';
import ApiService from '../framework/api-service';

export default class ProductsServiceApi extends ApiService {
  constructor(endPoint, authorizationToken) {
    super(endPoint, authorizationToken);
  }

  getProductsList = async () => {
    const request = await this._load({url: 'flowers-shop/products', method: Method.GET});

    return await ApiService.parseResponse(request);
  };

  getBasket = async () => {
    const request = await this._load({url: 'flowers-shop/cart', method: Method.GET});

    return await ApiService.parseResponse(request);
  };

  getExpandedProductInformation = async (productId) => {
    const request = await this._load({url: `flowers-shop/products/${productId}`, method: Method.GET});

    return await ApiService.parseResponse(request);
  };

  addOrIncrementProduct = async (productId) => {
    const request = await this._load({
      url: `flowers-shop/products/${productId}`,
      method: Method.PUT,
    });

    return await ApiService.parseResponse(request);
  };

  deleteOrDecrementProduct = async (productId) => await this._load({
    url: `flowers-shop/products/${productId}`,
    method: Method.DELETE,
  });
}
