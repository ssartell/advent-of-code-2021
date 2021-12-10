import R from 'ramda';

export const walkGrid = grid => {
  const walk = [];
  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[y].length; x++) {
      walk.push({x, y});
    }
  }
  return walk;
};

export const isInBounds = R.curry((grid, {x, y}) => {
  return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length;
});

export const getValue = R.curry((grid, pos) => {
  if (pos.x < 0 || grid[0].length <= pos.x || pos.y < 0 || grid.length <= pos.y) {
    return undefined;
  }
  return grid[pos.y][pos.x];
});