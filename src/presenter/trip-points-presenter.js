import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import {SortType, UpdateType, UserActions, FilterTypes} from '../const.js';
import {sortByDay, sortByPrice} from '../utils/sort.js';
import {filter} from '../utils/filter.js';

export default class TripPointsPresenter {
  #tripPointsContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #sortComponent = null;
  #pointsListComponent = new PointsListView();
  #noPointsComponent = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterTypes.EVERYTHING;
  #pointPresenter = new Map();
  #newPointPresenter = null;

  constructor(tripPointsContainer, pointsModel, offersModel, destinationsModel, filterModel) {
    this.#tripPointsContainer = tripPointsContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#newPointPresenter = new NewPointPresenter(this.#pointsListComponent.element, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDay);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }

    return this.#pointsModel.points;
  }

  init = () => {
    this.#renderTripPoints();
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#newPointPresenter.init(callback, this.#offersModel, this.#destinationsModel);
  };

  #handleModelChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserActions.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserActions.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserActions.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data, this.#offersModel, this.#destinationsModel);
        break;
      case UpdateType.MINOR:
        this.#clearTripPoints();
        this.#renderTripPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearTripPoints({resetSortType: true});
        this.#renderTripPoints();
        break;
    }
  };

  #handleSortTypeChange = (type) => {
    if (this.#currentSortType === type) {
      return;
    }
    this.#currentSortType = type;
    this.#clearTripPoints();
    this.#renderTripPoints();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#tripPointsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoints = (points) => {
    points.forEach((tripPoint) => this.#renderPoint(tripPoint));
  };

  #clearTripPoints = ({resetSortType = false} = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderNoPoints = () => {
    this.#noPointsComponent = new NoPointsView(this.#filterType);
    render(this.#noPointsComponent, this.#tripPointsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsListComponent.element, this.#handleViewAction, this.#handleModelChange);
    pointPresenter.init(point, this.#offersModel, this.#destinationsModel);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderTripPoints = () => {
    const points = this.points;
    if (points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    render(this.#pointsListComponent, this.#tripPointsContainer);
    this.#renderPoints(points);
  };
}
