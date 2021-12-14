import R from 'ramda';
import { min, max } from '../utils/ramda.js';
import { split, parseInput } from './part1.js';

export default R.pipe(parseInput, x => split(x.rules, x.template, 10), R.values, R.converge(R.subtract, [max, min]));