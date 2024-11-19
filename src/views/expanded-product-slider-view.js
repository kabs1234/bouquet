import AbstractView from '../framework/view/abstract-view.js';

const createImagesList = (images, authorPhoto) => {
  const imageListItems = images.map((image, index) => {
    if (index === 0) {
      return (`
        <div class="image-slides-list__item swiper-slide" role="group" aria-label="1 / 3" style="width: 1074px; margin-right: 100px;">
          <div class="image-slide">
            <img src="${image}" width="1274" height="1789" alt="">
            <span class="image-author image-slide__author">Автор  фотографии:  «${authorPhoto}»</span>
          </div>
        </div>
      `);
    } else {
      return (`
        <div class="image-slides-list__item swiper-slide" role="group" aria-label="1 / 3" style="width: 1074px; margin-right: 100px;">
          <div class="image-slide">
            <img src="${image}" width="1274" height="1789" alt="">
          </div>
        </div>
      `);
    }
  });

  return (`
    <div class="image-slides-list swiper-wrapper" id="swiper-wrapper-49110ed2c0bd082a10" aria-live="polite" style="transform: translate3d(-2348px, 0px, 0px); transition-duration: 0ms;">
      ${imageListItems.join('')}
    </div>
  `);
};

const createExpandedProductSliderTemplate = (productData) => (`
  <div class="image-slider swiper modal-product__slider swiper-initialized swiper-horizontal swiper-pointer-events">
    ${createImagesList(productData.images, productData.authorPhoto)}
    <button class="btn-round btn-round--to-left image-slider__button image-slider__button--prev" type="button" tabindex="0" aria-label="Предыдущий слайд" aria-controls="swiper-wrapper-49110ed2c0bd082a10" aria-disabled="false">
      <svg width="80" height="85" aria-hidden="true" focusable="false">
        <use xlink:href="#icon-round-button"></use>
      </svg>
    </button>
    <button class="btn-round btn-round--to-right image-slider__button image-slider__button--next swiper-button-disabled" type="button" tabindex="-1" aria-label="Следующий слайд" aria-controls="swiper-wrapper-49110ed2c0bd082a10" aria-disabled="true" disabled="">
      <svg width="80" height="85" aria-hidden="true" focusable="false">
        <use xlink:href="#icon-round-button"></use>
      </svg>
    </button>
    <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
  </div>
`);

export default class ExpandedProductSliderView extends AbstractView {
  #productData = null;

  constructor(productData) {
    super();
    this.#productData = productData;
  }

  get template() {
    return createExpandedProductSliderTemplate(this.#productData);
  }
}
