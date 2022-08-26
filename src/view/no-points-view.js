import AbstractView from '../framework/view/abstract-view';

const createNoPointsTemplate = function() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
};

export default class noPointsView extends AbstractView {
  get template() {
    return createNoPointsTemplate();
  }
}
