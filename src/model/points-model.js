import {getTripPoint} from '../mock/trip-point.js';
import {destinations} from '../mock/const.js';
import {offersByType} from '../mock/const.js';

export default class PointModel {
  points = Array.from({length: 10}, getTripPoint);
  getPoints = () => this.points;

  getDestinations = () => destinations;
  getOffers = () => offersByType;

  getCurrentOffers = (point) => {
    this.currentOffers = offersByType.find((offer) => offer.type === point.type)
      .offers.filter((offer) => point.offers.includes(offer.id));
    return this.currentOffers;
  };

  getOffersByType = (point) => {
    this.offersByType = offersByType.find((offer) => offer.type === point.type);
    return this.offersByType;
  };

  getCurrentDestination = (point) => {
    this.currentDestination = destinations.find((destination) => (destination.id === point.destination));
    return this.currentDestination;
  };
}
