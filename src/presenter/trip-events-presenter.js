import EventEditView from '../view/event-edit-view.js';
import EventNewView from '../view/event-new-view.js';
import SortView from '../view/sort-view.js';
import EventPoinView from '../view/event-point-view.js';
import EventsListView from '../view/events-list.js';
import {render} from '../render.js';

export default class TripEventsPresenter {
  eventsListComponent = new EventsListView();

  init = (tripEventsContainer) => {
    this.tripEventsContainer = tripEventsContainer;
    render (new SortView(), this.tripEventsContainer);
    render(this.eventsListComponent, this.tripEventsContainer);
    render(new EventEditView() ,this.eventsListComponent.getElement());
    render(new EventNewView() ,this.eventsListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventPoinView(), this.eventsListComponent.getElement());
    }
  };
}
