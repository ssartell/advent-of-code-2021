import R from 'ramda';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split(','), R.map(parseInt), R.groupBy(R.identity), R.map(R.length));

const sum = R.pipe(R.values, R.sum);
const simulate = R.curry((days, generation) => {
  for(let i = 0; i < days; i++) {
    let tng = {};
    for(let key in generation) {
      let count = generation[key];
      if (key - 1 >= 0) {
        tng[key - 1] = count + (tng[key - 1] || 0);
      } else {
        tng[6] = count;
        tng[8] = count;
      }
    }
    generation = tng;
  }

  return sum(generation);
});

export default R.pipe(parseInput, simulate(256));