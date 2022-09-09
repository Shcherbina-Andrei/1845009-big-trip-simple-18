import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {tripTypes} from '../const.js';
import {formatSlashDate} from '../utils/format-date';
import {formatFirstLetterToUpperCase} from '../utils/format-text';

const createInputTypeTemplate = function(currentType) {
  const tripTypesList = tripTypes.map((tripType) => `
  <div class="event__type-item">
    <input id="event-type-${tripType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${tripType}" ${tripType === currentType ? 'checked' : ''}>
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

const createDestinationTemplate = function(tripDestination, allDestinations, type) {
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

const createPriceTemplate = function(price) {
  return (
    `<label class="event__label" for="event-price-1">
       <span class="visually-hidden">${price}</span>
       &euro;
     </label>
     <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">`
  );
};

const createOffersTemplate = function(currentOffers, offersByType) {
  const availableOffers = offersByType.offers.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.toLowerCase()}-1" data-offer-id="${offer.id}" type="checkbox"
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

const createPointEditTemplate = function (data) {
  const {basePrice, dateFrom, dateTo, destination, type, offers, destinations, offersByType} = data;
  const tripDestination = destinations.find((pointDestination) => (pointDestination.id === destination));

  return (
    `<form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            ${createInputTypeTemplate(type)}
          </div>

          <div class="event__field-group  event__field-group--destination">
            ${createDestinationTemplate(tripDestination, destinations, type)}
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

export default class PointEditView extends AbstractStatefulView {

  constructor(point, destinations, allOffers, offersByType) {
    super();
    this._state = PointEditView.parsePointToState(point, destinations, allOffers, offersByType);
    this.#setInnerHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state);
  }

  reset = (point) => {
    this.updateElement(
      PointEditView.parseStateToPoint(point)
    );
  };

  setCloseFormHandler = (callback) => {
    this._callback.closeForm = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeFormHandler);
  };

  setSubmitFormHandler = (callback) => {
    this._callback.submitForm = callback;
    this.element.addEventListener('submit', this.#submitFormHandler);
  };

  #closeFormHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeForm();
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSubmitFormHandler(this._callback.submitForm);
    this.setCloseFormHandler(this._callback.closeForm);
  };

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    this._callback.submitForm(PointEditView.parseStateToPoint(this._state));
  };

  #typeToggleHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: [],
      offersByType: this._state.allOffers.find((offers) => offers.type === evt.target.value)
    });
  };

  #destinationInputHandler = (evt) => {
    const currentDestination = this._state.destinations.find((destination) => destination.name === evt.target.value);
    this.updateElement({
      destination: currentDestination.id
    });
  };

  #dateFromInputHandler = (evt) => {
    this._setState({
      dateFrom: evt.target.value
    });
  };

  #dateToInputHandler = (evt) => {
    this._setState({
      dateTo: evt.target.value
    });
  };

  #priceInputHandler = (evt) => {
    this._setState({
      basePrice: evt.target.value
    });
  };

  #offersTogglesHandler = () => {
    const selectedOffers = this.element.querySelectorAll('.event__offer-checkbox:checked');
    const selectedOfferIds = [];
    selectedOffers.forEach((selectedOffer) => selectedOfferIds.push(Number(selectedOffer.dataset.offerId)));
    this._setState({
      offers: selectedOfferIds
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('#event-start-time-1').addEventListener('input', this.#dateFromInputHandler);
    this.element.querySelector('#event-end-time-1').addEventListener('input', this.#dateToInputHandler);
    this.element.querySelector('#event-price-1').addEventListener('input', this.#priceInputHandler);

    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersTogglesHandler);

    this.element.querySelector('.event__type-list').addEventListener('change', this.#typeToggleHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputHandler);
  };

  static parsePointToState = (point, destinations, allOffers, offersByType) => ({...point,
    destinations: destinations,
    allOffers: allOffers,
    offersByType: offersByType
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.destinations;
    delete point.offersByType;
    delete point.allOffers;
    return point;
  };
}
