import FilterView from './view/filter-view.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import PointModel from './model/points-model.js';
import {render} from './framework/render.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-body__page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointModel();
const tripEventsPresenter = new TripEventsPresenter();


render(new FilterView(pointsModel.points), tripControlsElement);
tripEventsPresenter.init(tripEventsElement, pointsModel);

