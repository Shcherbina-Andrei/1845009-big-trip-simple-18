import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripPointsPresenter from './presenter/trip-points-presenter.js';
import PointModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import {render, RenderPosition} from './framework/render.js';

const siteHeaderElement = document.querySelector('.page-header');
const mainTripHeaderElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsElement = mainTripHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-body__page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const filterModel = new FilterModel();
const pointsModel = new PointModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const newPointButtonComponent = new NewPointButtonView();

const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, pointsModel);
const tripPointsPresenter = new TripPointsPresenter(tripEventsElement, pointsModel, offersModel, destinationsModel, filterModel);

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripPointsPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

render(newPointButtonComponent, mainTripHeaderElement, RenderPosition.BEFOREEND);
newPointButtonComponent.setClickHandler(handleNewPointButtonClick);

filterPresenter.init();
tripPointsPresenter.init();

