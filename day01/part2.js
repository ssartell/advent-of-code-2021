import R from 'ramda';

export default R.pipe(R.split('\n'), R.map(parseInt), R.aperture(3), R.map(R.sum), R.aperture(2), R.map(R.apply(R.lt)), R.sum);

// const parseInput = R.pipe(R.split('\n'), R.map(parseInt));
// const isIncreasing = ([a, b]) => a < b;

// export default R.pipe(parseInput, R.aperture(3), R.map(R.sum), R.aperture(2), R.map(isIncreasing), R.sum);