import {getRandomInteger} from '../utils/util.js';
import {tripTypes} from '../const.js';
import {offersByType} from './mocks.js';
import {destinations} from './mocks.js';
import {getRandomArrayElement} from '../utils/util.js';

const getTripType = function () {
  const randomIndex = getRandomInteger(0, tripTypes.length - 1);
  return tripTypes[randomIndex];
};

const getRandomOffersIds = function (type) {
  const randomIds = [];
  const currentOffers = offersByType.find((offer) => offer.type === type);
  const randomLength = getRandomInteger(0, currentOffers.offers.length);
  if (randomLength === 0) {
    return randomIds;
  }
  for (let i = 0; i < randomLength; i++) {
    randomIds.push(currentOffers.offers[i].id);
  }
  return randomIds;
};

export const getTripPoint = function () {
  const type = getTripType();
  const destination = getRandomArrayElement(destinations);

  return ({
    id: getRandomInteger(1, 100),
    basePrice: getRandomInteger(200, 1500),
    dateFrom: `2019-07-${getRandomInteger(10, 14)}T22:${getRandomInteger(30, 55)}:56.845Z`,
    dateTo: `2019-07-${14, 20}T11:${getRandomInteger(30, 55)}:13.375Z`,
    destination: destination.id,
    offers: getRandomOffersIds(type),
    type
  });
};
