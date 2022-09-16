const tripTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const SortType = {
  DEFAULT: 'default',
  DAY: 'sort-day',
  PRICE: 'sort-price'
};

const UserActions = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future'
};

export {tripTypes, SortType, UserActions, UpdateType, FilterTypes};
