import {offersByType} from '../mock/mocks.js';

export default class OffersModel {
  #offersByType = offersByType;

  get offersByType() {
    return this.#offersByType;
  }

  getCurrentOffersByType = (point) => {
    const currentOffersByType = this.#offersByType.find((offer) => offer.type === point.type);
    return currentOffersByType;
  };

  getSelectedOffers = (point) => {
    const currentOffersByType = this.getCurrentOffersByType(point);
    if (currentOffersByType) {
      const selectedOffers = currentOffersByType.offers.filter((offer) => point.offers.includes(offer.id));
      return selectedOffers;
    } else {
      return null;
    }
  };
}
