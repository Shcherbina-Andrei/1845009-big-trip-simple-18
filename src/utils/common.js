const getRandomInteger = function(a = 0, b = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = function(elements) {
  return elements[getRandomInteger(0, elements.length - 1)];
};

export {getRandomInteger, getRandomArrayElement};
