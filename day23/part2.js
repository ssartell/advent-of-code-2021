import R from 'ramda';
import { getCardinalNeighbors, getValue, setValue } from '../utils/grid.js';
import { aStar } from '../utils/graph-traversal.js';
import { add, equals, toString } from '../utils/vec2.js';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split('\r\n'), R.map(R.split('')));

const isWall = (grid, pos) => getValue(grid, pos) === '#';
const isOpen = (grid, pos) => getValue(grid, pos) === '.';
const isVoid = (grid, pos) => getValue(grid, pos) === ' ';
const isValid = (state, amphipod, dir) => {
  let pos = add(amphipod.pos, dir);
  if (!isOpen(state.grid, pos)) return false;
  if (R.any(other => equals(pos, other.pos), state.amphipods)) return false;
  if (amphipod.pos.x !== endCols[amphipod.type] && dir.y > 0) return false;
  return true;
};

const dirs = [{x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}];
const amphipodTypes = ['A', 'B', 'C', 'D'];
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

  for(let amphipod of R.reverse(state.amphipods)) {
    if (isAmphipodHome(state, amphipod)) {
      state.home.add(amphipod.id);
    }
  }
  return state;
};

const getSiblings = (state, amphipod) => state.amphipods.filter(x => x.id !== amphipod.id && x.type === amphipod.type);
const countSiblingsAtHome = (state, amphipod) => getSiblings(state, amphipod).filter(x => state.home.has(x.id)).length;

const isAmphipodHome = (state, amphipod) => {
  if (amphipod.pos.y < endRow) return false;
  if (endCols[amphipod.type] !== amphipod.pos.x) return false;

  // check if other amphipods are home
  if (countSiblingsAtHome(state, amphipod) !== state.grid.length - 2 - amphipod.pos.y) return false;
  return true;
};

const isValidStop = (state) => {
  let pos = state.lastMoved.pos;
  if (R.any(x => equals(x, pos), invalidStops)) return false;
  // if (pos.y >= endRow && pos.x !== endCols[state.lastMoved.type]) return false;
  // if (pos.y === endRow && isFree(state, add(pos, {x: 0, y: 1}))) return false;
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
  let newAmphipod = { ...amphipod, pos: newPos };
  
  let stopped = new Set(state.stopped);
  if (state.lastMoved && amphipod !== state.lastMoved) {
    stopped.add(state.lastMoved.id);
  }

  let newState = {
    ...state,
    cost: state.cost + costs[amphipod.type],
    amphipods: [
      ...R.filter(x => x.id !== amphipod.id, state.amphipods),
      newAmphipod],
    stopped,
    home: new Set(state.home),
    lastMoved: newAmphipod,
    lastState: state
  };

  if (isAmphipodHome(newState, newAmphipod)) {
    newState.home.add(newAmphipod.id);
  }

  return newState;
};

const organize = start => {
  let statesTested = 0;
  const isEnd = state => {
    // if (state.cost >= 22699) replay(state);
    statesTested++;
    for(let amphipod of state.amphipods) {
      if(!state.home.has(amphipod.id)) return false;
    }
    console.log(state.cost);
    return false;
  };

  const getNeighbors = state => {
    //print(state);
    let neighbors = [];
    let amphipods = [...state.amphipods];
    if (state.lastMoved && !state.home.has(state.lastMoved.id)
      && (!isValidStop(state) || wasStopped(state, state.lastMoved) || state.lastMoved.pos.y !== 1)) {
      // must keep moving
      amphipods = [state.lastMoved];
    }

    for(let amphipod of amphipods) {
      if (state.home.has(amphipod.id)) continue;
      for(let dir of dirs) {
        let newPos = add(amphipod.pos, dir);
        if (!isValid(state, amphipod, dir)) continue;
        neighbors.push(getNewState(state, amphipod, newPos));
      }
    }
    
    return neighbors;
  };

  const getCost = state => state.cost;
  const getHeuristic = state => {
    let totalCost = 0;
    let home = {};
    for(let amphipod of state.amphipods) {
      if (state.home.has(amphipod.id)) {
        home[amphipod.type] = home[amphipod.type] || 0;
        home[amphipod.type]++;
        continue;
      }
      let cost = Math.abs(endCols[amphipod.type] - amphipod.pos.x); // horizontal cost
      cost += amphipod.pos.y - (endRow - 1); // vertical cost
      totalCost += cost * costs[amphipod.type];
    }
    for(let type of amphipodTypes) {
      let left = (state.grid.length - 1) - endRow;
      if (home[type]) {
        left -= home[type];
      }
      totalCost += (left * (left + 1) / 2) * costs[type];
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
  console.log(`states tested: ${statesTested}`);
  if (best) replay(best);
  return best;
};

export default R.pipe(parseInput, toState, organize, x => x?.cost);