import dayjs from 'dayjs';

const formatStringToDate = function(dueDate) {
  return dayjs(dueDate).format('MMM D');
};

const formatStringToTime = function(dueDate) {
  return dayjs(dueDate).format('HH:mm');
};

const formatSlashDate = function(dueDate) {
  return dayjs(dueDate).format('DD/MM/YY HH:mm');
};

export {formatStringToDate, formatStringToTime, formatSlashDate};
