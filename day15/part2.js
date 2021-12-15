import R from 'ramda';
import { aStar } from '../utils/graph-traversal.js';
import { sub, scale, divVec, floor, modVec, equals, manhattan, toString } from '../utils/vec2.js';
import { getCardinalNeighborsUnbounded, getValue, getSize } from '../utils/grid.js';

const parseLine = R.pipe(R.split(''), R.map(Number));
const parseInput = R.pipe(R.split('\r\n'), R.map(parseLine));

const findPath = grid => {
  let start = { x: 0, y: 0, cost: 0 };
  let size = getSize(grid);
  let end = sub(scale(size, 5), { x: 1, y: 1 });
  const isEnd = x => equals(x, end);
  const getNeighbors = x => getCardinalNeighborsUnbounded(grid, x)
    .filter(n => n.x >= 0 && n.y >= 0 && n.x <= end.x && n.y <= end.y)
    .map(n => R.merge(n, { 
      cost: x.cost + (getValue(grid, modVec(n, size)) + manhattan(floor(divVec(n, size))) - 1) % 9 + 1
    }));
  const g = x => x.cost;
  const h = x => manhattan(x, end);
  return aStar(start, isEnd, getNeighbors, g, h, toString);
}

export default R.pipe(parseInput, findPath, R.prop('cost'));