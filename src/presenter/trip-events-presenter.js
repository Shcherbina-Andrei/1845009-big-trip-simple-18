import PointEditView from '../view/point-edit-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import EventsListView from '../view/points-list.js';
import noPointsView from '../view/no-points-view.js';
import {render, replace} from '../framework/render.js';

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

    if (this.#tripPoints.length === 0) {
      render(new noPointsView(), this.#tripEventsContainer);
    } else {
      render (new SortView(), this.#tripEventsContainer);
      render(this.#eventsListComponent, this.#tripEventsContainer);
      for (let i = 0; i < this.#tripPoints.length; i++) {
        this.#renderPoint(this.#tripPoints[i]);
      }
    }
  };

  #renderPoint = function (point) {
    const selectedOffers = this.#pointModel.getSelectedOffers(point);
    const offesByType = this.#pointModel.getCurrentOffersByType(point);
    const destination = this.#pointModel.getCurrentDestination(point);

    const pointComponent = new PointView(point, destination, selectedOffers);
    const pointEditComponent = new PointEditView(point, this.#tripDestinations, offesByType);

    const replaceCardToForm = () => {
      replace(pointEditComponent, pointComponent);
    };

    const replaceFormToCard = () => {
      replace(pointComponent, pointEditComponent);
    };

    const onEscKeyDown = function(evt) {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.setOpenFormHandler(() => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setCloseFormHandler(() => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setSubmitFormHandler(() => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#eventsListComponent.element);
  };
}
