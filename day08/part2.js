import R from 'ramda';
import M from 'mnemonist/set.js';

const parseLine = R.pipe(R.split(' | '), R.map(R.split(' ')), R.map(R.map(x => new Set(x))), R.zipObj(['signals', 'output']));
const parseInput = R.pipe(R.split('\r\n'), R.map(parseLine));

let areSetsEqual = (a, b) => a.size === b.size && [...a].every(x => b.has(x));

const match = {
  0: (map, x) => x.size === 6 && !match[6](map, x) && areSetsEqual(M.union(x, map[3]), map[8]),
  1: (map, x) => x.size === 2,
  2: (map, x) => x.size === 5 && !match[3](map, x) && areSetsEqual(M.union(x, map[4]), map[8]),
  3: (map, x) => x.size === 5 && areSetsEqual(M.union(x, map[1]), x),
  4: (map, x) => x.size === 4,
  5: (map, x) => x.size === 5 && !match[3](map, x) && !match[2](map, x),
  6: (map, x) => x.size === 6 && areSetsEqual(M.union(x, map[1]), map[8]),
  7: (map, x) => x.size === 3,
  8: (map, x) => x.size === 7,
  9: (map, x) => x.size === 6 && !match[6](map, x) && !match[0](map, x)
};

const solveOutput = ({signals, output}) => {
  let map = {};
  for(let i of [1,7,4,8,3,2,5,6,0,9]){
    map[i] = R.find(x => match[i](map, x), signals);
  }
  let res = "";
  for(let outputSet of output) {
    for(let i = 0; i <= 9; i++) {
      if(areSetsEqual(map[i], outputSet)) {
        res += i;
      }
    }
  }
  return parseInt(res);
}

export default R.pipe(parseInput, R.map(solveOutput), R.sum);