import R from 'ramda';
import { min, max } from '../utils/ramda.js';

const parseInput = R.pipe(R.split(','), R.map(parseInt));

const sumRange = n => n * (n + 1) / 2;
const costToPosition = (pos, crabs) => R.pipe(R.map(x => sumRange(Math.abs(x - pos))), R.sum)(crabs);
const tryEveryPosition = crabs => R.map(pos => costToPosition(pos, crabs), R.range(min(crabs), max(crabs) + 1));

export default R.pipe(parseInput, tryEveryPosition, min);