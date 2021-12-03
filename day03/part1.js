import R from 'ramda';

const toDigit = R.pipe(R.join(''), x => parseInt(x, 2));
const parseLine = R.pipe(R.trim(), R.split(''), R.map(parseInt));
const parseInput = R.pipe(R.split('\n'), R.map(parseLine));
const mostCommon = xs => Math.round(R.sum(xs) / xs.length);
const toGamma = R.pipe(R.map(mostCommon), toDigit);
const leastCommon = xs => xs.length > 1 ? 1 - mostCommon(xs) : xs[0];
const toEpsilon = R.pipe(R.map(leastCommon), toDigit);

export default R.pipe(parseInput, R.transpose, R.converge(R.multiply, [toEpsilon, toGamma]));