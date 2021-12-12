import R from 'ramda';
import { toString } from '../utils/vec2.js';
import { getCardinalNeighbors, getValue } from '../utils/grid.js';
import { bfs } from '../utils/graph-traversal.js';
import { parseInput, findLowPoints } from './part1.js';

const getNeighbors = R.curry((grid, pos) => R.filter(n => getValue(grid, n) < 9, getCardinalNeighbors(grid, pos)));

const findBasinSize = R.curry((grid, lowPoint) => {
  let count = 0;
  bfs(lowPoint, () => { count++; return false; }, getNeighbors(grid), toString);
  return count;
});

const findBasinSizes = grid => R.map(findBasinSize(grid), findLowPoints(grid));

export default R.pipe(parseInput, findBasinSizes, R.sortBy(x => x), R.takeLast(3), R.reduce(R.multiply, 1));