import R, { groupBy } from 'ramda';
import { gridPositions, getNeighbors, getValue, setValue } from '../utils/grid.js';
import m from 'mnemonist';
let { Queue } = m;

const parseInput = R.pipe(R.split('\r\n'), R.map(R.pipe(R.split(''), R.map(Number))));

const simulate = R.curry((steps, grid) => {
  let flashCount = 0;
  for(let i = 0; i < steps; i++) {
    const newGrid = R.clone(grid);
    const flashes = new Queue();

    for(let pos of gridPositions(newGrid)) {
      let newValue = getValue(newGrid, pos) + 1;
      setValue(newGrid, pos, newValue);
      if (newValue === 10) {
        flashes.enqueue(pos);
      }
    }

    while(flashes.size > 0) {
      flashCount++;
      let pos = flashes.dequeue();
      for(let neighbor of getNeighbors(newGrid, pos)) {
        let newValue = getValue(newGrid, neighbor) + 1;
        setValue(newGrid, neighbor, newValue);
        if (newValue === 10) {
          flashes.enqueue(neighbor);
        }
      }
    }

    for(let pos of gridPositions(newGrid)) {
      let newValue = getValue(newGrid, pos);
      if (newValue > 9) {
        setValue(newGrid, pos, 0);
      }
    }
    grid = newGrid;
  }
  return flashCount
});

export default R.pipe(parseInput, simulate(100));