import FilterView from './view/filter-view.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import {render} from './render.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-body__page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');
const tripEventsPresenter = new TripEventsPresenter();


render(new FilterView(), tripControlsElement);
tripEventsPresenter.init(tripEventsElement);

