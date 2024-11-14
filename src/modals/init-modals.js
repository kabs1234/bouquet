import { Modals } from './modals';

let modals;

// Здесь реализован пример открытия модалки через колбэк закрытия
// const openModalInCloseCallback = (name, context = this) => {
//   context._enableScrolling = false;
//   context._setSettings('default');
//   modals.open(name);
// };

const closeCallback = () => {
  const expandedProductDescription = document.querySelector('.product-description');
  const imageSlider = document.querySelector('.image-slider');

  expandedProductDescription.remove();
  imageSlider.remove();
};

const settings = {
  default: {
    preventDefault: true,
    stopPlay: true,
    lockFocus: true,
    startFocus: true,
    focusBack: true,
    eventTimeout: 400,
    openCallback: false,
    closeCallback,
  },
};

const initModals = () => {
  const modalElements = document.querySelectorAll('.modal');
  if (modalElements.length) {
    modalElements.forEach((el) => {
      setTimeout(() => {
        el.classList.remove('modal--preload');
      }, 100);
    });
  }

  modals = new Modals(settings);
};

export { modals, initModals };
