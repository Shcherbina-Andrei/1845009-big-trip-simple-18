import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointsListContainer = null;
  #changeMode = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor(pointsListContainer, changeMode) {
    this.#pointsListContainer = pointsListContainer;
    this.#changeMode = changeMode;
  }

  init = function(point, pointsModel) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    const selectedOffers = pointsModel.getSelectedOffers(this.#point);
    const offersByType = pointsModel.getCurrentOffersByType(this.#point);
    const currentDestination = pointsModel.getCurrentDestination(this.#point);
    const destinations = pointsModel.destinations;
    this.#pointComponent = new PointView(point, currentDestination, selectedOffers);
    this.#pointEditComponent = new PointEditView(point, destinations, offersByType);

    this.#pointComponent.setOpenFormHandler(this.#handleOpenForm);
    this.#pointEditComponent.setSubmitFormHandler(this.#handleSubmitForm);
    this.#pointEditComponent.setCloseFormHandler(this.#handleCloseForm);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }
  };

  destroy = function() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  resetView = function() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  };

  #replaceCardToForm = function(){
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToCard = function() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = function(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleOpenForm = () => {
    this.#replaceCardToForm();
  };

  #handleSubmitForm = () => {
    this.#replaceFormToCard();
  };

  #handleCloseForm = () => {
    this.#replaceFormToCard();
  };
}
