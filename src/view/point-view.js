import AbstractView from '../framework/view/abstract-view.js';
import {formatStringToDate, formatStringToTime} from '../utils/date-utils.js';

const createTemplateOffers = (offers) => {
  if (!offers?.length) {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">No additional offers</span>
      </li>`
    );
  }
  const selectedOffers = offers.map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`).join('');
  return selectedOffers;
};

const createPointTemplate = (point, destination, offers) => {
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

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;

  constructor(point, destination, offers) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
  }

  get template() {
    return createPointTemplate(this.#point, this.#destination, this.#offers);
  }

  setOpenFormHandler = (callback) => {
    this._callback.openForm = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#openFormHandler);
  };

  #openFormHandler = (evt) => {
    evt.preventDefault();
    this._callback.openForm();
  };
}
