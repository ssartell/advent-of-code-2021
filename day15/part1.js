import R from 'ramda';
import { aStar } from '../utils/graph-traversal.js';
import { sub, equals, manhattan, toString } from '../utils/vec2.js';
import { getCardinalNeighbors, getValue, getSize } from '../utils/grid.js';

const parseLine = R.pipe(R.split(''), R.map(Number));
const parseInput = R.pipe(R.split('\r\n'), R.map(parseLine));

const findPath = grid => {
  let start = { x: 0, y: 0, cost: 0 };
  let end = sub(getSize(grid), { x: 1, y: 1 });
  const isEnd = x => equals(x, end);
  const getNeighbors = x => getCardinalNeighbors(grid, x).map(n => R.merge(n, { cost: x.cost + getValue(grid, n)}));
  const g = x => x.cost;
  const h = x => manhattan(x, end);
  return aStar(start, isEnd, getNeighbors, g, h, toString);
}

export default R.pipe(parseInput, findPath, R.prop('cost'));