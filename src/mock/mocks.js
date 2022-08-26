import {getRandomInteger} from '../utils/common.js';

const getDescription = function() {
  const descriptions = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.', 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.', 'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.', 'In rutrum ac purus sit amet tempus'];

  return descriptions[getRandomInteger(0, descriptions.length - 1)];
};

const getPhoto = function() {
  return {
    src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 20)}`,
    description: 'In rutrum ac purus sit amet tempus'
  };};

const offersByType = [
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      },
      {
        id: 2,
        title: 'Upgrade',
        price: 220,
      },
      {
        id: 3,
        title: 'Upgrade+',
        price: 320,
      }
    ]
  },
  {
    type: 'bus',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a comfort class',
        price: 20,
      },
      {
        id: 2,
        title: 'Upgrade',
        price: 50,
      }
    ]
  },
  {
    type: 'train',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a comfort class',
        price: 200,
      },
      {
        id: 2,
        title: 'Upgrade',
        price: 600,
      }
    ]
  },
  {
    type: 'ship',
    offers: [
      {
        id: 1,
        title: 'Upgrade',
        price: 45,
      },
      {
        id: 2,
        title: 'Upgrade+',
        price: 50,
      }
    ]
  },
  {
    type: 'drive',
    offers: [
      {
        id: 1,
        title: 'Upgrade+',
        price: 60,
      },
      {
        id: 2,
        title: 'Upgrade to business class',
        price: 500,
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 300,
      },
      {
        id: 2,
        title: 'Upgrade',
        price: 100,
      },
      {
        id: 3,
        title: 'Upgrade+',
        price: 150,
      }
    ]
  },
  {
    type: 'check-in',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a comfort class',
        price: 20,
      },
      {
        id: 2,
        title: 'Upgrade',
        price: 50,
      }
    ]
  },
  {
    type: 'sightseeing',
    offers: [
      {
        id: 1,
        title: 'Upgrade',
        price: 15,
      }
    ]
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: 1,
        title: 'Upgrade',
        price: 60,
      },
      {
        id: 2,
        title: 'Upgrade+',
        price: 150,
      }
    ]
  }
];

const destinations = [
  {
    id: 1,
    description: getDescription(),
    name: 'London',
    pictures: [getPhoto(), getPhoto(), getPhoto(), getPhoto()],
  },
  {
    id: 2,
    description: getDescription(),
    name: 'Paris',
    pictures: [getPhoto(), getPhoto(), getPhoto(), getPhoto()],
  },
  {
    id: 3,
    description: getDescription(),
    name: 'Madrid',
    pictures: [getPhoto(), getPhoto(), getPhoto(), getPhoto()],
  },
  {
    id: 1,
    description: getDescription(),
    name: 'Rome',
    pictures: [getPhoto(), getPhoto(), getPhoto(), getPhoto()],
  },
  {
    id: 4,
    description: getDescription(),
    name: 'Liverpool',
    pictures: [getPhoto(), getPhoto(), getPhoto(), getPhoto()],
  },
  {
    id: 5,
    description: getDescription(),
    name: 'Amsterdam',
    pictures: [getPhoto(), getPhoto(), getPhoto(), getPhoto()],
  },
  {
    id: 6,
    description: getDescription(),
    name: 'Barcelona',
    pictures: [getPhoto(), getPhoto(), getPhoto(), getPhoto()],
  },
];

export {offersByType, destinations};
