import R from 'ramda';
import { equals } from '../utils/vec2.js';
import { range } from '../utils/ramda.js';
import { fold } from './part1.js';

const parseDots = R.map(R.pipe(R.split(','), R.map(Number), R.zipObj(['x', 'y'])));
const parseFolds = R.map(R.pipe(R.split(' '), R.last, R.split('='), R.zipObj(['dir', 'pos']), R.evolve({ pos: Number })));
const parseInput = R.pipe(R.split('\r\n\r\n'), R.map(R.split('\r\n')), R.zipObj(['dots', 'folds']), R.evolve({ dots: parseDots, folds: parseFolds }));

const print = dots => {
  let result = "";
  let [minX, maxX] = range(R.map(x => x.x, dots));
  let [minY, maxY] = range(R.map(x => x.y, dots));
  for(let y = minY; y <= maxY; y++) {
    for(let x = minX; x <= maxX; x++) {
      let dot = { x, y };
      result += R.any(x => equals(x, dot), dots) ? '#' : ' ';
    }
    result += '\n';
  }
  return result;
};

const foldAll = input => R.reduce(fold, input.dots, input.folds);

export default R.pipe(parseInput, foldAll, print);