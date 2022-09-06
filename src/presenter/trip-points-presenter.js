import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import noPointsView from '../view/no-points-view.js';
import {render, RenderPosition} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils/common.js';
import {SortType} from '../const.js';
import {sortByDay, sortByPrice} from '../utils/sort.js';

export default class TripPointsPresenter {
  #tripPointsContainer = null;
  #pointModel = null;
  #sortComponent = new SortView();
  #pointsListComponent = new PointsListView();
  #noPointsComponent = new noPointsView();

  #tripPoints = [];
  #sourcedTripPoints = [];
  #currentSortType;
  #pointPresenter = new Map();

  constructor(tripPointsContainer, pointModel) {
    this.#tripPointsContainer = tripPointsContainer;
    this.#pointModel = pointModel;
  }

  init = function() {
    this.#tripPoints = [...this.#pointModel.points];
    this.#sourcedTripPoints = [...this.#pointModel.points];

    this.#renderTripPoints();
  };

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#sourcedTripPoints = updateItem(this.#sourcedTripPoints. updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #sortPoints = (type) => {
    switch (type) {
      case SortType.DAY:
        this.#tripPoints.sort(sortByDay);
        break;
      case SortType.PRICE:
        this.#tripPoints.sort(sortByPrice);
        break;
    }

    this.#currentSortType = type;
  };

  #handleSortTypeChange = (type) => {
    if (this.#currentSortType === type) {
      return;
    }

    this.#sortPoints(type);
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #renderSort = function() {
    render(this.#sortComponent, this.#tripPointsContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderPointsList = function() {
    render(this.#pointsListComponent, this.#tripPointsContainer, RenderPosition.BEFOREEND);
    this.#tripPoints.forEach((tripPoint) => this.#renderPoint(tripPoint));
  };

  #clearPointsList = function() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderNoPoints = function() {
    render(this.#noPointsComponent, this.#tripPointsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = function(point) {
    const pointPresenter = new PointPresenter(this.#pointsListComponent.element, this.#handleModeChange);
    pointPresenter.init(point, this.#pointModel);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderTripPoints = function() {
    if (this.#tripPoints.length === 0) {
      this.#renderNoPoints();
    } else {
      this.#renderSort();
      this.#sortPoints(SortType.DAY);
      this.#renderPointsList();
    }
  };
}
