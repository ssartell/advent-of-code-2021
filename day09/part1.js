import R from 'ramda';
import { add, rotate90 } from '../utils/vec2.js';
import { walkGrid, isInBounds, getValue } from '../utils/grid.js';

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
}

export default R.pipe(parseInput, grid => R.map(getValue(grid), findLowPoints(grid)), R.map(R.add(1)), R.sum);