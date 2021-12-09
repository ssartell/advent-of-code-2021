import R from 'ramda';

const toBinary = x => "abcdefg".split('').reduce((a, y) => (a << 1) | x.includes(y), 0);
const parseLine = R.pipe(R.split(' | '), R.map(R.split(' ')), R.map(R.map(toBinary)));
const parseInput = R.pipe(R.split('\r\n'), R.map(parseLine));
const size = x => (x.toString(2).match(/1/g) || []).length;

const match = {
  0: (map, x) => size(x) === 6 && (x | map[3]) === map[8],
  1: (map, x) => size(x) === 2,
  2: (map, x) => size(x) === 5 && (x | map[4]) === map[8],
  3: (map, x) => size(x) === 5 && (x | map[1]) === x,
  4: (map, x) => size(x) === 4,
  5: (map, x) => size(x) === 5,
  6: (map, x) => size(x) === 6 && (x | map[1]) === map[8],
  7: (map, x) => size(x) === 3,
  8: (map, x) => size(x) === 7,
  9: (map, x) => size(x) === 6
};

const solveOutput = ([signals, output]) => {
  let map = {};
  for(let i of [1,7,4,8,3,2,5,6,0,9]) {
    map[i] = R.find(x => match[i](map, x), signals);
    signals = R.without([map[i]], signals);
  }
  let res = "";
  for(let outputSet of output) {
    for(let i = 0; i <= 9; i++) {
      if(map[i] === outputSet) {
        res += i;
      }
    }
  }
  return parseInt(res);
}

export default R.pipe(parseInput, R.map(solveOutput), R.sum);