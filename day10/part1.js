import R from 'ramda';
import m from 'mnemonist';
let { Stack } = m;

const parseInput = R.pipe(R.split('\n'), R.map(R.split('')));

const isOpen = x => !!x.match(/[\(\[\{\<]/);
const isClose = x => !!x.match(/[\)\]\}\>]/);
const openMatchesClose = (open, close) => Math.abs(close.charCodeAt(0) - open.charCodeAt(0)) <= 2;
const scores = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

const corrupted = line => {
  const stack = new Stack();
  let score = 0;
  for(let i = 0; i < line.length; i++) {
    let char = line[i];
    if (isOpen(char)) {
      stack.push(char);
    } else if (isClose(char)) {
      let openChar = stack.pop();
      if (openMatchesClose(openChar, char)) {
        continue;
      } else {
        return scores[char]; // corrupted
      }
    }
  }
  return score;
}

export default R.pipe(parseInput, R.map(corrupted), R.sum);