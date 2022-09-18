import dayjs from 'dayjs';

const formatStringToDate = (dueDate) => dayjs(dueDate).format('MMM D');

const formatStringToTime = (dueDate) => dayjs(dueDate).format('HH:mm');

const formatSlashDate = function(dueDate) {
  return dayjs(dueDate).format('DD/MM/YY HH:mm');
};

const isPointFuture = (dueDate) => dayjs(dueDate).isAfter(dayjs(), 'D') || dayjs(dueDate).isSame(dayjs(), 'D');

const currentDate = () => dayjs().format('DD/MM/YY HH:mm');

export {formatStringToDate, formatStringToTime, formatSlashDate, isPointFuture, currentDate};
