import {createElement} from '../render.js';
import {tripTypes} from '../const.js';
import {formatSlashDate} from '../utils/util.js';
import {formatFirstLetterToUpperCase} from '../utils/util.js';

const createInputTypeTemplate = function (currentType) {
  const tripTypesList = tripTypes.map((tripType) => `
  <div class="event__type-item">
    <input id="event-type-${tripType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${tripType === currentType ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${tripType}" for="event-type-${tripType}-1">${formatFirstLetterToUpperCase(tripType)}</label>
  </div>`).join('');

  return (
    `<label class="event__type  event__type-btn" for="event-type-toggle-1">
       <span class="visually-hidden">Choose event type</span>
       <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
     </label>
     <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

     <div class="event__type-list">
       <fieldset class="event__type-group">
         <legend class="visually-hidden">Event type</legend>
         ${tripTypesList}
       </fieldset>
     </div>`
  );
};

const createDestinationTemplate = function (tripDestination, allDestinations, type) {
  const destinationsOptions = allDestinations.map((destination) => `<option value="${destination.name}"></option>`).join('');
  return (
    `<label class="event__label  event__type-output" for="event-destination-1">
       ${formatFirstLetterToUpperCase(type)}
     </label>
     <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${tripDestination.name}" list="destination-list-1">
     <datalist id="destination-list-1">
       ${destinationsOptions}
     </datalist>`);
};

const createTimeTemplate = function(dateFrom, dateTo) {
  return (
    `<label class="visually-hidden" for="event-start-time-1">From</label>
     <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatSlashDate(dateFrom)}">
     &mdash;
     <label class="visually-hidden" for="event-end-time-1">To</label>
     <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatSlashDate(dateTo)}">`
  );
};

const createPriceTemplate = function (price) {
  return (
    `<label class="event__label" for="event-price-1">
       <span class="visually-hidden">${price}</span>
       &euro;
     </label>
     <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">`
  );
};

const createOffersTemplate = function (currentOffers, offersByType) {
  const availableOffers = offersByType.offers.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.toLowerCase()}-1" type="checkbox"
      name="event-offer-${offer.title.toLowerCase()}" ${currentOffers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.title.toLowerCase()}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `).join('');
  return availableOffers;
};

const createPointEditTemplate = function (point, allDestinations, offersByType) {
  const {basePrice, dateFrom, dateTo, destination, type, offers} = point;
  const tripDestination = allDestinations.find((pointDestination) => (pointDestination.id === destination));

  return (
    `<form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            ${createInputTypeTemplate(type)}
          </div>

          <div class="event__field-group  event__field-group--destination">
            ${createDestinationTemplate(tripDestination, allDestinations, type)}
          </div>

          <div class="event__field-group  event__field-group--time">
            ${createTimeTemplate(dateFrom, dateTo)}
          </div>

          <div class="event__field-group  event__field-group--price">
            ${createPriceTemplate(basePrice)}
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${createOffersTemplate(offers, offersByType)}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${tripDestination.description}</p>
          </section>
        </section>
    </form>`
  );
};

export default class PointEditView {
  #point = null;
  #destinations = null;
  #offersByType = null;
  #element = null;

  constructor(point, destinations, offersByType) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
  }

  get template() {
    return createPointEditTemplate(this.#point, this.#destinations, this.#offersByType);
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
