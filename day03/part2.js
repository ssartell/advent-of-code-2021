import R from 'ramda';

const toDigit = R.pipe(R.join(''), x => parseInt(x, 2));
const parseLine = R.pipe(R.trim(), R.split(''), R.map(parseInt));
const parseInput = R.pipe(R.split('\n'), R.map(parseLine));
const mostCommon = xs => R.sum(xs) >= xs.length / 2 ? 1 : 0;
const leastCommon = xs => xs.length > 1 ? 1 - mostCommon(xs) : xs[0];

const isMatch = R.curry((target, i, num) => num[i] === target);
const getDigits = (xs, i) => R.pipe(R.transpose, xs => xs[i])(xs);
const filterBy = R.curry((f, nums, i) => R.filter(isMatch(f(getDigits(nums, i)), i), nums));
const find = R.curry((f, nums) => R.reduce(filterBy(f), nums, R.range(0, nums[0].length)));

const oxygenGeneratorRating = R.pipe(find(mostCommon), R.head, toDigit);
const co2ScrubberRating = R.pipe(find(leastCommon), R.head, toDigit);

export default R.pipe(parseInput, R.converge(R.multiply, [co2ScrubberRating, oxygenGeneratorRating]));