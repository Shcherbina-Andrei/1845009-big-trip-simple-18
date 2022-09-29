import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripPointsPresenter from './presenter/trip-points-presenter.js';
import PointModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import {render, RenderPosition} from './framework/render.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic fsdfsdfsfwr34324wrw';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const siteHeaderElement = document.querySelector('.page-header');
const mainTripHeaderElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsElement = mainTripHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-body__page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const filterModel = new FilterModel();
const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const pointsModel = new PointModel(pointsApiService);
const offersModel = new OffersModel(pointsApiService);
const destinationsModel = new DestinationsModel(pointsApiService);
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

filterPresenter.init();
tripPointsPresenter.init();

Promise.all([offersModel.init(), destinationsModel.init()])
  .then(() => pointsModel.init())
  .finally(() => {
    render(newPointButtonComponent, mainTripHeaderElement, RenderPosition.BEFOREEND);
    newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
  });


