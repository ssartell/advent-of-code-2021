import R from 'ramda';

const toDigit = R.pipe(R.join(''), x => parseInt(x, 2));
const parseLine = R.pipe(R.trim(), R.split(''), R.map(parseInt));
const parseInput = R.pipe(R.split('\n'), R.map(parseLine));
const mostCommon = xs => R.sum(xs) >= xs.length / 2;
const leastCommon = xs => 1 - mostCommon(xs);

const toGamma = R.pipe(R.map(mostCommon), toDigit);
const toEpsilon = R.pipe(R.map(leastCommon), toDigit);

export default R.pipe(parseInput, R.transpose, R.converge(R.multiply, [toEpsilon, toGamma]));