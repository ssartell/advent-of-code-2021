import R from 'ramda';
import { add, sub, reflect, cross, toString } from '../utils/vec2.js';

const parseDots = R.map(R.pipe(R.split(','), R.map(Number), R.zipObj(['x', 'y'])));
const parseFolds = R.map(R.pipe(R.split(' '), R.last, R.split('='), R.zipObj(['dir', 'pos']), R.evolve({ pos: Number })));
export const parseInput = R.pipe(R.split('\r\n\r\n'), R.map(R.split('\r\n')), R.zipObj(['dots', 'folds']), R.evolve({ dots: parseDots, folds: parseFolds }));

export const fold = (dots, fold) => {
  let pos = fold.dir === 'x' ? { x: fold.pos, y: 0 } : { x: 0, y: fold.pos };
  let dir = fold.dir === 'x' ? { x: 0, y: 1 } : { x: -1, y: 0 };
  let newDots = [];
  let seen = new Set();
  for(let dot of dots) {
    let v = sub(pos, dot);
    let newDot = cross(v, dir) > 0 ? dot : add(pos, reflect(v, dir));
    let key = toString(newDot);
    if (seen.has(key)) continue;
    newDots.push(newDot);
    seen.add(key);
  }
  return newDots;
}

export default R.pipe(parseInput, input => fold(input.dots, input.folds[0]), R.length);