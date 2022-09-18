import AbstractView from '../framework/view/abstract-view';
import {FilterTypes} from '../const';

const NoPointsTextType = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.FUTURE]: 'There are no future events now'
};


const createNoPointsTemplate = (filterType) => {
  const noPointsTextValue = NoPointsTextType[filterType];
  return `<p class="trip-events__msg">${noPointsTextValue}</p>`;
};

export default class NoPointsView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}
