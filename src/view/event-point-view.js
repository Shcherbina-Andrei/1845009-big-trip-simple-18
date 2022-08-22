import {createElement} from '../render.js';
import {formatStringToDate} from '../utils/util.js';
import {formatStringToTime} from '../utils/util.js';

const createTemplateOffers = function (offers) {
  if (offers.length === 0) {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">No additional offers</span>
      </li>`
    );
  }
  const newOffersContainer = document.createElement('div');
  for (let i = 0; i < offers.length; i++) {
    const newOfferElement = document.createElement('li');
    newOfferElement.classList.add('event__offer');
    newOfferElement.insertAdjacentHTML('beforeend', `
      <span class="event__offer-title">${offers[i].title}</span>
        &plus;&euro;&nbsp;
      <span class="event__offer-price">${offers[i].price}</span>
    `);
    newOffersContainer.appendChild(newOfferElement);
  }
  return newOffersContainer.innerHTML;
};

const createEventPointTemplate = (point, destination, offers) => {
  const {basePrice, type, dateFrom, dateTo} = point;
  const {name} = destination;

  const eventDate = formatStringToDate(dateFrom);

  const timeFrom = formatStringToTime(dateFrom);
  const timeTo = formatStringToTime(dateTo);

  return (
    `<div class="event">
      <time class="event__date" datetime="${dateFrom}">${eventDate}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${timeFrom}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo}">${timeTo}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createTemplateOffers(offers)}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
};

export default class EventPointView {
  #point = null;
  #destination = null;
  #offers = null;
  #element = null;

  constructor(point, destination, offers) {
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
  }

  get template() {
    return createEventPointTemplate(this.#point, this.#destination, this.#offers);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
