import R from 'ramda';

export const combinations = function* (list, n) {
  var keys = [];
  var index = 0;
  for (var i = 0; i < n; i++) {
    keys.push(-1);
  }
  while (index >= 0) {
    if (keys[index] < list.length - (n - index)) {
      for (var key = keys[index] - index + 1; index < n; index++) {
        keys[index] = key + index;
      }
      yield keys.map(x => list[x]);
    } else {
      index--;
    }
  }
};

export const permutations = R.compose(R.sequence(R.of), R.flip(R.repeat));

export const pairs = xs => {
  const pair = [];
  for(let i = 0; i < xs.length; i++) {
    for(let j = i + 1; j < xs.length; j++) {
      pair.push([xs[i], xs[j]]);
    }
  }
  return pair;
};
