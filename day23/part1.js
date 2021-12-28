import R from 'ramda';
import { getCardinalNeighbors, getValue, setValue } from '../utils/grid.js';
import { aStar } from '../utils/graph-traversal.js';
import { add, equals, toString } from '../utils/vec2.js';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split('\r\n'), R.map(R.split('')));

const isWall = (grid, pos) => getValue(grid, pos) === '#';
const isOpen = (grid, pos) => getValue(grid, pos) === '.';
const isVoid = (grid, pos) => getValue(grid, pos) === ' ';
const isFree = (state, pos) => {
  if (!isOpen(state.grid, pos)) return false;
  if (R.any(other => equals(pos, other.pos), state.amphipods)) return false;
  return true;
};

const dirs = [{x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}];
const amphipods = ['A', 'B', 'C', 'D'];
const costs = { 'A': 1, 'B': 10, 'C': 100, 'D': 1000 };
const endCols = { 'A': 3, 'B': 5, 'C': 7, 'D': 9 };
const endRow = 2;
const invalidStops = R.values(endCols).map(x => ({ x, y: endRow - 1 }));

const toState = grid => {
  let state = {
    grid,
    cost: 0,
    amphipods: [],
    stopped: new Set(),
    home: new Set(),
    lastMoved: null
  };
  let id = 0;
  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[y].length; x++) {
      let pos = {x, y};
      let char = getValue(grid, pos);
      if(!isWall(grid, pos) && !isOpen(grid, pos) && !isVoid(grid, pos)) {
        let amphipod = { type: char, pos, id: id++ };
        state.amphipods.push(amphipod);
        setValue(grid, pos, '.');
      }
    }
  }

  for(let amphipod of state.amphipods) {
    if (isAmphipodHome(state, amphipod)) {
      state.home.add(amphipod);
    }
  }
  return state;
};

const getSibling = (state, amphipod) => {
  for(let other of state.amphipods) {
    if (other === amphipod) continue;
    if (other.type === amphipod.type) return other;
  }
  return null;
};

const isAmphipodHome = (state, amphipod) => {
  if (amphipod.pos.y < endRow) return false;
  if (endCols[amphipod.type] === amphipod.pos.x && 
    amphipod.pos.y === endRow + 1 || 
    (amphipod.pos.y === endRow && state.home.has(getSibling(state, amphipod)))) return true;
  return false;
};

const isValidStop = (state) => {
  let pos = state.lastMoved.pos;
  if (R.any(x => equals(x, pos), invalidStops)) return false;
  if (pos.y >= endRow && pos.x !== endCols[state.lastMoved.type]) return false;
  if (pos.y === endRow && isFree(state, add(pos, {x: 0, y: 1}))) return false;
  return true;
};

const wasStopped = (state, amphipod) => state.stopped.has(amphipod.id);

// const isHomeOpen = (state, amphipod) => {
//   if (!isFree(state, {x: endCols[amphipod.type], y: endRow})) return false;
//   let sibling = getSibling(state, amphipod);
//   if (sibling.pos.x === endCols[amphipod.type] &&  sibling.pos.y === endRow + 1) return true;
//   if (!isFree(state, {x: endCols[amphipod.type], y: endRow + 1})) return false;
//   return true;
// };

const print = state => {
  let result = `cost: ${state.cost}\n`;
  if (state.lastMoved) {
    result += `is valid stop: ${isValidStop(state)}\n`;
  }
  for(let y = 0; y < state.grid.length; y++) {
    for(let x = 0; x < state.grid[y].length; x++) {
      let pos = {x, y};
      let char = getValue(state.grid, pos);
      let amphipod = R.find(x => equals(x.pos, pos), state.amphipods);
      result += amphipod ? amphipod.type : char;
    }
    result += '\n';
  }
  console.log(result);
};

const replay = state => {
  if (state.lastState)
    replay(state.lastState);
  print(state);
};

const getNewState = (state, amphipod, newPos) => {
  let newAmphipod = { type: amphipod.type, pos: newPos, id: amphipod.id };
  
  let stopped = new Set(state.stopped);
  if (state.lastMoved && amphipod !== state.lastMoved) {
    stopped.add(state.lastMoved.id);
  }

  let newState = {
    ...state,
    cost: state.cost + costs[amphipod.type],
    amphipods: [
      ...R.filter(x => x !== amphipod, state.amphipods),
      newAmphipod],
    stopped,
    home: new Set(state.home),
    lastMoved: newAmphipod,
    lastState: state
  };

  if (isAmphipodHome(newState, newAmphipod)) {
    newState.home.add(newAmphipod);
  }

  return newState;
};

const organize = start => {
  let statesTested = 0;
  const isEnd = state => {
    statesTested++;
    for(let amphipod of state.amphipods) {
      if(!state.home.has(amphipod)) return false;
    }
    return true;
  };

  const getNeighbors = state => {
    // print(state);
    let neighbors = [];
    if ((state.lastMoved && !isValidStop(state))
    || (state.lastMoved && wasStopped(state, state.lastMoved) && !state.home.has(state.lastMoved))) {
      // keep moving if invalid
      let amphipod = state.lastMoved;
      for(let dir of dirs) {
        let newPos = add(amphipod.pos, dir);
        if (!isFree(state, newPos)) continue;
        let newState = getNewState(state, amphipod, newPos);
        neighbors.push(newState);
      }
    } else {
      for(let amphipod of state.amphipods) {
        if (state.home.has(amphipod)) continue;
        for(let dir of dirs) {
          let newPos = add(amphipod.pos, dir);
          if (!isFree(state, newPos)) continue;
          neighbors.push(getNewState(state, amphipod, newPos));
        }
      }
    }
    
    return neighbors;
  };

  const getCost = state => state.cost;
  const getHeuristic = state => {
    let totalCost = 0;
    for(let amphipod of state.amphipods) {
      if (state.home.has(amphipod)) continue;
      let cost = Math.abs(endCols[amphipod.type] - amphipod.pos.x); // horizontal cost
      if (amphipod.pos.x !== endCols[amphipod.type]) {
        cost += Math.abs(1 - amphipod.pos.y) + 1;
      }
      totalCost += cost * costs[amphipod.type];
    }
    return totalCost;
  };

  const sortFns = [
    R.ascend(x => x.type),
    R.ascend(x => x.pos.x),
    R.ascend(x => x.pos.y)
  ];
  const getKey = state => {
    let keys = [];
    for(let amphipod of R.sortWith(sortFns, state.amphipods)) {
      keys.push(`${amphipod.type}:${toString(amphipod.pos)}`);
    }
    return keys.join(',');
  };
  let best = aStar(start, isEnd, getNeighbors, getCost, getHeuristic, getKey);
  console.log(statesTested);
  // if (best)
  //   replay(best);
  return best;
};

export default R.pipe(parseInput, toState, organize, x => x?.cost);