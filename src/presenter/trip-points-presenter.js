import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import noPointsView from '../view/no-points-view.js';
import {render, RenderPosition} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils/common.js';

export default class TripPointsPresenter {
  #tripPointsContainer = null;
  #pointModel = null;
  #sortComponent = new SortView();
  #pointsListComponent = new PointsListView();
  #noPointsComponent = new noPointsView();

  #tripPoints = [];
  #pointPresenter = new Map();

  constructor(tripPointsContainer, pointModel) {
    this.#tripPointsContainer = tripPointsContainer;
    this.#pointModel = pointModel;
  }

  init = function() {
    this.#tripPoints = [...this.#pointModel.points];

    this.#renderTripPoints();
  };

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderSort = function() {
    render(this.#sortComponent, this.#tripPointsContainer, RenderPosition.AFTERBEGIN);
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
      this.#renderPointsList();
    }
  };
}
