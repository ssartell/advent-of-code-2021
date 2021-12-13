import R from 'ramda';
import { bfs } from '../utils/graph-traversal.js';

const parseLine = R.pipe(R.split('-'));
const parseInput = R.pipe(R.split('\r\n'), R.map(parseLine));

const buildMap = input => {
  let map = new Map();
  for(let [from, to] of R.concat(input, R.map(R.reverse, input))) {
    if (!map.has(from)) map.set(from, []);
    if (to !== "start" && from !== "end") map.get(from).push(to);
  }
  return map;
};

const isLargeCave = x => x.toUpperCase() === x;

const countPaths = map => {
  let pathsCount = 0;
  let key = 0;
  const getNeighbors = x => {
    let visited = new Set(x.visited).add(x.name);
    let legalNeighbors = R.filter(x => isLargeCave(x) || !visited.has(x), map.get(x.name));
    return R.map(neighbor => ({ name: neighbor, visited }), legalNeighbors);
  };
  const isEnd = x => { 
    if (x.name === "end") pathsCount++;
    return false;
  };
  const getKey = () => key++;
  bfs({ name: "start", visited: new Set() }, isEnd, getNeighbors, getKey);
  return pathsCount;
};

export default R.pipe(parseInput, buildMap, countPaths);