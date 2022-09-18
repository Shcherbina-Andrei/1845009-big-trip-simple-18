import {FilterTypes} from '../const';
import {isPointFuture} from './date-utils.js';

const filter = {
  [FilterTypes.EVERYTHING]: (points) => points,
  [FilterTypes.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom)),
};

export {filter};
