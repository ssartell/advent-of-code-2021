import R from 'ramda';
import { min, max } from '../utils/ramda.js';
import { expandPolymer, parseInput } from './part1.js';

export default R.pipe(parseInput, x => expandPolymer(x.rules, x.template, 40), R.values, R.converge(R.subtract, [max, min]));