import R from 'ramda';
import { parseInput, applyAlgo } from './part1.js';

export default R.pipe(parseInput, applyAlgo(50), x => x.size);