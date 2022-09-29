import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import {UserActions, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointsListContainer = null;
  #changeData = null;
  #changeMode = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #allOffers = null;
  #selectedOffers = null;
  #currentOffersByType = null;
  #currentDestination = null;
  #destinations = null;
  #mode = Mode.DEFAULT;

  constructor(pointsListContainer, changeData, changeMode) {
    this.#pointsListContainer = pointsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, offersModel, destinationsModel) => {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#allOffers = offersModel.offersByType;
    this.#selectedOffers = offersModel.getSelectedOffers(this.#point);
    this.#currentOffersByType = offersModel.getCurrentOffersByType(this.#point);
    this.#currentDestination = destinationsModel.getCurrentDestination(this.#point);
    this.#destinations = destinationsModel.destinations;

    this.#pointComponent = new PointView(point, this.#currentDestination, this.#selectedOffers);

    this.#pointComponent.setOpenFormHandler(this.#handleOpenForm);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };

  #replaceCardToForm = () => {
    this.#pointEditComponent = new PointEditView(this.#destinations, this.#allOffers, this.#point, this.#currentOffersByType);
    this.#pointEditComponent.setSubmitFormHandler(this.#handleSubmitForm);
    this.#pointEditComponent.setCloseFormHandler(this.#handleCloseForm);
    this.#pointEditComponent.setDeletePointHandler(this.#handleDeletePoint);
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToCard = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #handleOpenForm = () => {
    this.#replaceCardToForm();
  };

  #handleSubmitForm = (point) => {
    this.#changeData(
      UserActions.UPDATE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleDeletePoint = (point) => {
    this.#changeData(
      UserActions.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleCloseForm = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToCard();
  };
}
