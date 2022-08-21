import dayjs from 'dayjs';

const getRandomInteger = function (a = 0, b = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = function (elements) {
  return elements[getRandomInteger(0, elements.length - 1)];
};

const formatStringToDate = function (dueDate) {
  return dayjs(dueDate).format('MMM D');
};

const formatStringToTime = function (dueDate) {
  return dayjs(dueDate).format('HH:mm');
};

const formatSlashDate = function (dueDate) {
  return dayjs(dueDate).format('DD/MM/YY HH:mm');
};

export {getRandomInteger, getRandomArrayElement, formatStringToDate, formatStringToTime, formatSlashDate};
