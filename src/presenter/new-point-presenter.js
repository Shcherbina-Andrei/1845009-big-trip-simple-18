import {render, remove, RenderPosition} from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import {nanoid} from 'nanoid';
import {UserActions, UpdateType} from '../const.js';

export default class NewPointPresenter {
  #pointsListContainer = null;
  #changeData = null;
  #pointEditComponent = null;
  #destroyCallback = null;

  constructor(pointsListContainer, changeData) {
    this.#pointsListContainer = pointsListContainer;
    this.#changeData = changeData;
  }

  init = (callback, offersModel, destinationsModel) => {
    this.#destroyCallback = callback;

    if (this.#pointEditComponent !== null) {
      return;
    }

    const allOffers = offersModel.offersByType;
    const destinations = destinationsModel.destinations;
    this.#pointEditComponent = new PointEditView(destinations, allOffers);
    this.#pointEditComponent.setSubmitFormHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeletePointHandler(this.#handleDeleteClick);

    render(this.#pointEditComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserActions.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };


  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
