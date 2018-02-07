import moment from 'moment';

const DEPRECATION_MESSAGE = 'isSameUser and isSameDay should be imported from the utils module instead of using the props functions';

export function isSameDay(currentMessage = {}, diffMessage = {}) {

  if (!diffMessage.createdAt) {
    return false
  }

  let currentCreatedAt = moment(currentMessage.createdAt);
  let diffCreatedAt = moment(diffMessage.createdAt);

  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
    return false;
  }

  return currentCreatedAt.isSame(diffCreatedAt, 'day');

}

export function isSameUser(currentMessage = {}, diffMessage = {}) {

  return !!(diffMessage.user && currentMessage.user && diffMessage.user._id === currentMessage.user._id);

}

export function warnDeprecated(fn) {

  return (...args) => {
    console.warn(DEPRECATION_MESSAGE);
    return fn(...args);
  };

}

export function pick(obj, keys) {
  const ret = {

  };
  keys.forEach((key) => {
    if (obj.hasOwnProperty(key)) {
      ret[key] = obj[key]
    }
  });
  return ret;
}

export function omit(obj, keys) {
  const ret = {
    ...obj
  };
  keys.forEach((key) => {
    delete ret[key];
  });
  return ret;
}
