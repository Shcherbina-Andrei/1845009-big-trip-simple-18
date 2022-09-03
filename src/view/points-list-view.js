import AbstractView from '../framework/view/abstract-view';

const createPointsListTemplate = function() {
  return '<ul class="trip-events__list"></ul>';
};

export default class PointsListView extends AbstractView {
  get template() {
    return createPointsListTemplate();
  }
}
