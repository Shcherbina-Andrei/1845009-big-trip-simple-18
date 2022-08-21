import EventEditView from '../view/event-edit-view.js';
import SortView from '../view/sort-view.js';
import EventPoinView from '../view/event-point-view.js';
import EventsListView from '../view/events-list.js';
import {render} from '../render.js';

export default class TripEventsPresenter {
  eventsListComponent = new EventsListView();

  init = (tripEventsContainer, pointModel) => {
    this.tripEventsContainer = tripEventsContainer;
    this.pointModel = pointModel;
    this.tripPoints = [...pointModel.getPoints()];
    this.tripDestinations = [...pointModel.getDestinations()];
    this.tripOffers = [...pointModel.getOffers()];

    render (new SortView(), this.tripEventsContainer);
    render(this.eventsListComponent, this.tripEventsContainer);
    const currentOffersByType = this.pointModel.getOffersByType(this.tripPoints[0]);
    render(new EventEditView(this.tripPoints[0], this.tripDestinations, currentOffersByType) ,this.eventsListComponent.getElement());

    for (let i = 1; i < this.tripPoints.length; i++) {
      const offers = this.pointModel.getCurrentOffers(this.tripPoints[i]);
      const destination = this.pointModel.getCurrentDestination(this.tripPoints[i]);
      render(new EventPoinView(this.tripPoints[i], destination, offers), this.eventsListComponent.getElement());
    }
  };
}
