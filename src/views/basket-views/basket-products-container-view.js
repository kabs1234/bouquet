import AbstractView from '../../framework/view/abstract-view.js';

// const createBasketProductsContainer = (productsData, basketData) => {
//   const basketCatalogItemsString = basketCatalogItems.join('');

//   return (`
//     <ul class="popup-deferred__catalog">
//       ${basketCatalogItemsString}
//     </ul>
//   `);
// };

const createBasketProductsContainerTemplate = () => '<ul class="popup-deferred__catalog"></ul>';

export default class BasketProductsContainerView extends AbstractView {
  get template() {
    return createBasketProductsContainerTemplate();
  }

  clearBasketProductsContainer = () => {
    const basketProductsContainer = document.querySelector('.popup-deferred__catalog');
    basketProductsContainer.remove();
  };
}