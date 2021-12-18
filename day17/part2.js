import R from 'ramda';
import { add } from '../utils/vec2.js';

const lineRegex = /x=(-?\d*)..(-?\d*), y=(-?\d*)..(-?\d*)/;
const parseInput = R.pipe(R.match(lineRegex), R.tail, R.map(Number), R.zipObj(['minX', 'maxX', 'minY', 'maxY']));

const findRanges = bounds => ({
  minX: R.find(x => x * (x + 1) / 2 >= bounds.minX, R.range(0, bounds.minX)),
  maxX: bounds.maxX,
  minY: bounds.minY,
  maxY: Math.abs(bounds.minY),
});

const inTarget = (pos, target) => target.minX <= pos.x && pos.x <= target.maxX && target.minY <= pos.y && pos.y <= target.maxY;

const simulate = (v, target) => {
  let pos = { x: 0, y: 0 };
  while(pos.y >= target.minY) {
    pos = add(pos, v);
    v = add(v, { x: -Math.sign(v.x), y: -1 });
    if (inTarget(pos, target)) 
      return true;
  }
  return false;
};

const findAllValidVelocties = target => {
  const ranges = findRanges(target);
  const velocities = R.range(ranges.minX, ranges.maxX + 1).map(x => R.range(ranges.minY, ranges.maxY + 1).map(y => ({ x, y })));
  return R.filter(v => simulate(v, target), R.flatten(velocities));
};

export default R.pipe(parseInput, findAllValidVelocties, R.length);