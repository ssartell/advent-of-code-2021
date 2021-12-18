import R from 'ramda';

const parseInput = R.pipe(R.match(/y=(-?\d*)/), R.last, Number);

export default R.pipe(parseInput, Math.abs, x => (x - 1) * x / 2);