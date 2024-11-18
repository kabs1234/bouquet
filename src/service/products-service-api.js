import { Method } from '../constants';
import ApiService from '../framework/api-service';

export default class ProductsServiceApi extends ApiService {
  constructor(endPoint, authorizationToken) {
    super(endPoint, authorizationToken);
  }

  getProductsList = async () => {
    const request = await this._load({url: 'flowers-shop/products', method: Method.Get});

    return await ApiService.parseResponse(request);
  };

  getBasket = async () => {
    const request = await this._load({url: 'flowers-shop/cart', method: Method.Get});

    return await ApiService.parseResponse(request);
  };

  getExpandedProductInformation = async (productId) => {
    const request = await this._load({url: `flowers-shop/products/${productId}`, method: Method.Get});

    return await ApiService.parseResponse(request);
  };

  addProductToBasket = async (productId) => {
    const request = await this._load({
      url: `flowers-shop/products/${productId}`,
      method: Method.Put,
    });

    return await ApiService.parseResponse(request);
  };

  deleteProductFromBasket = async (productId) => await this._load({
    url: `flowers-shop/products/${productId}`,
    method: Method.Delete,
  });
}
