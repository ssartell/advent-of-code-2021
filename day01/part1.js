import R from 'ramda';

const parseInput = R.pipe(R.split('\n'), R.map(parseInt));
const isIncreasing = ([a, b]) => a < b;

export default R.pipe(parseInput, R.aperture(2), R.map(isIncreasing), R.sum);