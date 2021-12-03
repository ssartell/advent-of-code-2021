import R from 'ramda';

const parseLine = R.pipe(R.trim(), R.split(''), R.map(parseInt));
const parseInput = R.pipe(R.split('\n'), R.map(parseLine));
const mostCommon = xs => R.sum(xs) >= xs.length / 2 ? 1 : 0;
const leastCommon = xs => xs.length > 1 ? 1 - mostCommon(xs) : xs[0];

const toDigit = R.pipe(R.join(''), x => parseInt(x, 2));
const filterBy = R.curry((f, nums, i) => R.filter(x => x[i] === f(R.transpose(nums)[i]), nums));
const find = R.curry((f, nums) => toDigit(R.head(R.reduce(filterBy(f), nums, R.range(0, nums[0].length)))));

export default R.pipe(parseInput, R.converge(R.multiply, [find(mostCommon), find(leastCommon)]));