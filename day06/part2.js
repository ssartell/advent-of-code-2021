import R from 'ramda';

const parseInput = R.pipe(R.split(','), R.map(parseInt), R.groupBy(R.identity), R.map(R.length));

const simulate = R.curry((days, gen) => {
  while(days--) {
    let tng = {};
    for(let time in gen) {
      if (time - 1 >= 0) {
        tng[time - 1] = gen[time] + (tng[time - 1] || 0);
      } else {
        tng[6] = gen[time];
        tng[8] = gen[time];
      }
    }
    gen = tng;
  }
  return gen;
});

export default R.pipe(parseInput, simulate(256), R.values, R.sum);