import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {tripTypes} from '../const.js';
import {formatSlashDate} from '../utils/date-utils.js';
import {formatFirstLetterToUpperCase} from '../utils/format-text';
import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: null,
  destination: null,
  type: null,
  dateFrom: null,
  dateTo: null,
  offers: null
};

const createInputTypeTemplate = (currentType) => {
  const tripTypesList = tripTypes.map((tripType) => `
  <div class="event__type-item">
    <input id="event-type-${tripType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${tripType}" ${tripType === currentType ? 'checked' : ''} required>
    <label class="event__type-label  event__type-label--${tripType}" for="event-type-${tripType}-1">${formatFirstLetterToUpperCase(tripType)}</label>
  </div>`).join('');

  let typeImage;
  if (currentType) {
    typeImage = `<img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">`;
  }

  return (
    `<label class="event__type  event__type-btn" for="event-type-toggle-1">
       <span class="visually-hidden">Choose event type</span>
       ${currentType ? typeImage : ''}
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

const createDestinationTemplate = (tripDestination, allDestinations, type) => {
  const destinationsOptions = allDestinations.map((destination) => `<option value="${destination.name}"></option>`).join('');
  return (
    `<label class="event__label  event__type-output" for="event-destination-1">
       ${type ? formatFirstLetterToUpperCase(type) : ''}
     </label>
     <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${tripDestination ? tripDestination.name : ''}" list="destination-list-1" required>
     <datalist id="destination-list-1">
       ${destinationsOptions}
     </datalist>`);
};

const createTimeTemplate = (dateFrom, dateTo) => (
  `<label class="visually-hidden" for="event-start-time-1">From</label>
     <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom ? formatSlashDate(dateFrom) : ''}" required>
     &mdash;
     <label class="visually-hidden" for="event-end-time-1">To</label>
     <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo ? formatSlashDate(dateTo) : ''}" required>`
);

const createPriceTemplate = (price) => (
  `<label class="event__label" for="event-price-1">
       <span class="visually-hidden">${price}</span>
       &euro;
     </label>
     <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" required>`
);

const createOffersTemplate = (currentOffers, offersByType) => {
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
  return (`
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${availableOffers}
      </div>
    </section>
  `);
};

const createPhotosTemplate = (pictures) => {
  const photosContainer = pictures.map((picture) => `
  <img class="event__photo" src="${picture.src}" alt="${picture.description}">
  `).join('');
  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${photosContainer}
      </div>
    </div>`
  );
};

const createDestinationSectionTemplate = (tripDestination) => (`
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${tripDestination.description}</p>
    ${tripDestination.pictures ? createPhotosTemplate(tripDestination.pictures) : ''}
  </section>
  `);

const createPointEditTemplate = (data) => {
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
          ${offersByType ? createOffersTemplate(offers, offersByType) : ''}

          ${tripDestination ? createDestinationSectionTemplate(tripDestination) : ''}
        </section>
    </form>`
  );
};

export default class PointEditView extends AbstractStatefulView {
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor(destinations, allOffers, point = BLANK_POINT, offersByType = null) {
    super();
    this._state = PointEditView.parsePointToState(point, destinations, allOffers, offersByType);
    this.#setInnerHandlers();
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
  };

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

  setDeletePointHandler = (callback) => {
    this._callback.deletePoint = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deletePointHandler);
  };

  #closeFormHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeForm();
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSubmitFormHandler(this._callback.submitForm);
    this.setCloseFormHandler(this._callback.closeForm);
    this.setDeletePointHandler(this._callback.deletePoint);
  };

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    if (!this._state.type) {
      return;
    }
    if (!this._state.destination) {
      return;
    }

    if (!this._state.dateFrom) {
      return;
    }

    if (!this._state.dateTo) {
      return;
    }

    if (!this._state.basePrice) {
      return;
    }
    this._callback.submitForm(PointEditView.parseStateToPoint(this._state));
  };

  #deletePointHandler = (evt) => {
    evt.preventDefault();
    this._callback.deletePoint(PointEditView.parseStateToPoint(this._state));
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

  #dateFromInputHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate
    });
  };

  #dateToInputHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate
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

  #setDatepickerFrom = () => {
    this.#datepickerFrom = flatpickr (
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromInputHandler
      }
    );
  };

  #setDatepickerTo = () => {
    this.#datepickerTo = flatpickr (
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        enableTime: true,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToInputHandler
      }
    );
  };

  #setInnerHandlers = () => {
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
    this.element.querySelector('#event-price-1').addEventListener('input', this.#priceInputHandler);
    if ( this.element.querySelector('.event__available-offers')) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersTogglesHandler);
    }

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
