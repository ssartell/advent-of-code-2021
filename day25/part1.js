import R from 'ramda';
import { add, sub } from '../utils/vec2.js';
import { getValue, setValue, isInBounds } from '../utils/grid.js';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split('\r\n'), R.map(R.split('')));

const step = grid => {
  let anyMoved = 1;
  let step = 0;
  while(anyMoved > 0) {
    anyMoved = 0;
    step++;
    let newGrid = [];
    for (let y = 0; y < grid.length; y++) {
      newGrid.push(R.repeat('.', grid[y].length));
    }
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        let pos = { x, y };
        let newPos = add(pos, { x: 1, y: 0 });
        if (!isInBounds(grid, newPos)) {
          newPos = sub(newPos, { x: grid[0].length, y: 0 });
        }
        if (getValue(grid, pos) === '>') {
          let isFree = getValue(grid, newPos) === '.';
          anyMoved += isFree ? 1 : 0;
          setValue(newGrid, isFree ? newPos : pos, '>');
        }
      }
    }
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        let pos = { x, y };
        let newPos = add(pos, { x: 0, y: 1 });
        if (!isInBounds(grid, newPos)) {
          newPos = sub(newPos, { x: 0, y: grid.length });
        }
        if (getValue(grid, pos) === 'v') {
          let isFree = getValue(grid, newPos) !== 'v' && getValue(newGrid, newPos) === '.';
          anyMoved += isFree ? 1 : 0;
          setValue(newGrid, isFree ? newPos : pos, 'v');
        }
      }
    }
    grid = newGrid;
  }
  
  return step;
}

export default R.pipe(parseInput, step);