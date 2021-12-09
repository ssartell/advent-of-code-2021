import R from 'ramda';

const toBinary = x => "abcdefg".split('').reduce((a, y) => (a << 1) | x.includes(y), 0);
const parseLine = R.pipe(R.split(' | '), R.map(R.split(' ')), R.map(R.map(toBinary)));
const parseInput = R.pipe(R.split('\r\n'), R.map(parseLine));
const size = x => (x.toString(2).match(/1/g) || []).length;

const match = {
  0: (x, known) => size(x) === 6 && (x | known[3]) === known[8],
  1: (x, known) => size(x) === 2,
  2: (x, known) => size(x) === 5 && (x | known[4]) === known[8],
  3: (x, known) => size(x) === 5 && (x | known[1]) === x,
  4: (x, known) => size(x) === 4,
  5: (x, known) => size(x) === 5,
  6: (x, known) => size(x) === 6 && (x | known[1]) === known[8],
  7: (x, known) => size(x) === 3,
  8: (x, known) => size(x) === 7,
  9: (x, known) => size(x) === 6
};

const solveOutput = ([signals, output]) => {
  let knownDigits = [];
  for(let i of [1,7,4,8,3,2,5,6,0,9]) {
    knownDigits[i] = R.find(x => match[i](x, knownDigits), signals);
    signals = R.without([knownDigits[i]], signals);
  }
  let result = "";
  for(let outDigit of output) {
    for(let i = 0; i <= 9; i++) {
      if(knownDigits[i] === outDigit) {
        result += i;
      }
    }
  }
  return parseInt(result);
}

export default R.pipe(parseInput, R.map(solveOutput), R.sum);