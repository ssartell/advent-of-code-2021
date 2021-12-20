import R from 'ramda';
import { parseInput, add, magnitude } from './part1.js';
import { max } from '../utils/ramda.js';

const allPairs = nums => {
  const pairs = [];
  for(let a of nums) {
    for(let b of nums) {
      if (a !== b) {
        pairs.push(add(R.clone(a), R.clone(b)));
      }
    }
  }
  return pairs;
}

export default R.pipe(parseInput, allPairs, R.map(magnitude), max);