import R from 'ramda';
import { add, rotate90, toString } from '../utils/vec2.js';
import { walkGrid, isInBounds, getValue } from '../utils/grid.js';
import { bfs } from '../utils/graph-traversal.js';

const parseInput = R.pipe(R.split('\r\n'), R.map(R.split('')), R.map(R.map(Number)));

const findLowPoints = grid => {
  const walk = walkGrid(grid);
  const lowPoints = [];
  for(let pos of walk) {
    const value = getValue(grid, pos);
    let isLow = true;
    let dir = { x: 1, y: 0 };
    for(let i = 0; i < 4; i++) {
      const neighbor = add(pos, dir);
      if (isInBounds(grid, neighbor) && getValue(grid, neighbor) <= value)
        isLow = false;
      dir = rotate90(dir);
    }
    if (isLow)
      lowPoints.push(pos);
  }
  return lowPoints;
};

const getNeighbors = R.curry((grid, x) => {
  let neighbors = [];
  let dir = { x: 1, y: 0 };
  for(let i = 0; i < 4; i++) {
    const neighbor = add(x, dir);
    if (isInBounds(grid, neighbor) && getValue(grid, neighbor) < 9)
      neighbors.push(neighbor);
    dir = rotate90(dir);
  }
  return neighbors;
});

const findBasins = grid => {
  const lowPoints = findLowPoints(grid);
  return R.map(pos => {
    let count = 0;
    bfs(pos, () => { count++; return false; }, getNeighbors(grid), toString);
    return count;
  }, lowPoints);
}

export default R.pipe(parseInput, findBasins, R.sortBy(R.identity), R.reverse, R.take(3), R.reduce(R.multiply, 1));