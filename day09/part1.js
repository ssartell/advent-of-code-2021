import R from 'ramda';
import { gridPositions, getValue, getCardinalNeighbors } from '../utils/grid.js';

export const parseInput = R.pipe(R.split('\r\n'), R.map(R.split('')), R.map(R.map(Number)));

export const findLowPoints = grid => {
  const lowPoints = [];
  for(let pos of gridPositions(grid)) {
    const value = getValue(grid, pos);
    if (!R.any(n => getValue(grid, n) <= value, getCardinalNeighbors(grid, pos)))
      lowPoints.push(pos);
  }
  return lowPoints;
};

export default R.pipe(parseInput, grid => R.map(getValue(grid), findLowPoints(grid)), R.map(R.add(1)), R.sum);