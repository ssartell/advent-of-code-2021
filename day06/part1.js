import R from 'ramda';

const parseInput = R.pipe(R.split(','), R.map(parseInt));

const simulate = R.curry((days, fishes) => {
  for(let i = 0; i < days; i++) {
    let nextFishes = [];
    for(let fish of fishes) {
      if (fish == 0) {
        nextFishes.push(6);
        nextFishes.push(8);
      } else {
        nextFishes.push(fish - 1);
      }
    }
    fishes = nextFishes;
  }
  return fishes.length;
});

export default R.pipe(parseInput, simulate(80));