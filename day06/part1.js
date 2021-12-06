import R from 'ramda';

const parseInput = R.pipe(R.split(','), R.map(parseInt));

const simulate = R.curry((days, gen) => {
  while(days--) {
    let tng = [];
    for(let fish of gen) {
      if (fish === 0) {
        tng.push(6);
        tng.push(8);
      } else {
        tng.push(fish - 1);
      }
    }
    gen = tng;
  }
  return gen.length;
});

export default R.pipe(parseInput, simulate(80));