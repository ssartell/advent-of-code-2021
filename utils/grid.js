import R from 'ramda';
import { add, rotate90 } from './vec2.js';

export const gridPositions = grid => {
  const positions = [];
  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[y].length; x++) {
      positions.push({x, y});
    }
  }
  return positions;
};

export const getNeighbors = R.curry((grid, pos) => {
  const neighbors = [];
  for(let y = -1; y <= 1; y++) {
    for(let x = -1; x <= 1; x++) {
      if(x === 0 && y === 0) continue;
      const neighbor = add(pos, {x, y});
      if(!isInBounds(grid, neighbor)) continue;
      neighbors.push(neighbor);
    }
  }
  return neighbors;
});

export const getCardinalNeighbors = R.curry((grid, pos) => {
  let neighbors = [];
  let dir = {x: 1, y: 0};
  for(let i = 0; i < 4; i++) {
    let neighbor = add(pos, dir);
    if (isInBounds(grid, neighbor)) {
      neighbors.push(neighbor);
    }
    dir = rotate90(dir);
  }
  return neighbors;
});

export const isInBounds = R.curry((grid, {x, y}) => {
  return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length;
});

export const getValue = R.curry((grid, pos) => {
  if (pos.x < 0 || grid[0].length <= pos.x || pos.y < 0 || grid.length <= pos.y) {
    return undefined;
  }
  return grid[pos.y][pos.x];
});

export const setValue = R.curry((grid, pos, value) => {
  if (!isInBounds(grid, pos)) return false;
  grid[pos.y][pos.x] = value;
  return true;
});

export const readValues = grid => R.map(x => getValue(grid, x), gridPositions(grid));