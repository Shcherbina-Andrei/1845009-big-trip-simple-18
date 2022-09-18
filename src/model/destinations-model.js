import {destinations} from '../mock/mocks.js';

export default class DestinationsModel {
  #destinations = destinations;

  get destinations() {
    return this.#destinations;
  }

  getCurrentDestination = (point) => {
    this.currentDestination = destinations.find((destination) => (destination.id === point.destination));
    return this.currentDestination;
  };
}
