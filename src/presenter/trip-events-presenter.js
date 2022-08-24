import EventEditView from '../view/event-edit-view.js';
import SortView from '../view/sort-view.js';
import EventPointView from '../view/event-point-view.js';
import EventsListView from '../view/events-list.js';
import {render} from '../render.js';

export default class TripEventsPresenter {
  #tripEventsContainer = null;
  #pointModel = null;

  #eventsListComponent = new EventsListView();

  #tripPoints = [];
  #tripDestinations = [];
  #tripOffers = [];

  init = (tripEventsContainer, pointModel) => {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointModel = pointModel;
    this.#tripPoints = [...this.#pointModel.points];
    this.#tripDestinations = [...this.#pointModel.destinations];
    this.#tripOffers = [...this.#pointModel.offersByType];

    render (new SortView(), this.#tripEventsContainer);
    render(this.#eventsListComponent, this.#tripEventsContainer);

    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderPoint(this.#tripPoints[i]);
    }
  };

  #renderPoint = function (point) {
    const selectedOffers = this.#pointModel.getSelectedOffers(point);
    const offesByType = this.#pointModel.getCurrentOffersByType(point);
    const destination = this.#pointModel.getCurrentDestination(point);

    const pointComponent = new EventPointView(point, destination, selectedOffers);
    const pointEditComponent = new EventEditView(point, this.#tripDestinations, offesByType);

    const replaceCardToForm = () => {
      this.#eventsListComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    const replaceFormToCard = () => {
      this.#eventsListComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    const onEscKeyDown = function (evt) {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#eventsListComponent.element);
  };
}
