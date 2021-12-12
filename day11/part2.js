import R from 'ramda';
import { gridPositions, getNeighbors, getValue, setValue } from '../utils/grid.js';
import Queue from 'mnemonist/queue.js';

const parseInput = R.pipe(R.split('\r\n'), R.map(R.pipe(R.split(''), R.map(Number))));

const simulate = grid => {
  let step = 0;
  while(true) {
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
      let pos = flashes.dequeue();
      for(let neighbor of getNeighbors(newGrid, pos)) {
        let newValue = getValue(newGrid, neighbor) + 1;
        setValue(newGrid, neighbor, newValue);
        if (newValue === 10) {
          flashes.enqueue(neighbor);
        }
      }
    }  

    let sum = 0;
    for(let pos of gridPositions(newGrid)) {
      let newValue = getValue(newGrid, pos);
      if (newValue > 9) {
        setValue(newGrid, pos, 0);
        sum += 0;
      } else {
        sum += newValue;
      }
    }
    grid = newGrid;
    step++;
    if (sum === 0) {
      return step;
    }
  }
};

export default R.pipe(parseInput, simulate);