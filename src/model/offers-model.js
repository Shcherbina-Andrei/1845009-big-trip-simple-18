import {UpdateType} from '../const.js';
import Observable from '../framework/observable.js';

export default class OffersModel extends Observable{
  #pointsApiService = null;
  #offersByType = [];

  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get offersByType() {
    return this.#offersByType;
  }

  init = async () => {
    try {
      this.#offersByType = await this.#pointsApiService.offers;
    } catch(err) {
      this.#offersByType = [];
    }

    this._notify(UpdateType.INIT);
  };

  getCurrentOffersByType = (point) => {
    const currentOffersByType = this.offersByType.find((offer) => offer.type === point.type);
    return currentOffersByType;
  };

  getSelectedOffers = (point) => {
    const currentOffersByType = this.getCurrentOffersByType(point);
    if (currentOffersByType) {
      const selectedOffers = currentOffersByType.offers.filter((offer) => point.offers.includes(offer.id));
      return selectedOffers;
    }
  };
}
