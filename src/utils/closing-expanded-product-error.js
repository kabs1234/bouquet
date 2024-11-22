export default class ClosingExpandedProductError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ClosingExpandedProductError';
  }
}
