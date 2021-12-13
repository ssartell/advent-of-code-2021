import R from 'ramda';

export const min = R.reduce(R.min, Infinity);
export const max = R.reduce(R.max, -Infinity);
export const range = arr => [min(arr), max(arr)];