import R from 'ramda';
import m from 'mnemonist';
let { Stack } = m;

const parseInput = R.pipe(R.split('\n'), R.map(R.split('')));

const charPairs = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>'
};
const scores = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const isOpen = x => !!x.match(/[\(\[\{\<]/);
const isClose = x => !!x.match(/[\)\]\}\>]/);
const openMatchesClose = (open, close) => charPairs[open] === close;

const getClosingChars = stack => {
  let closingChars = [];
  for(let char of stack) {
    closingChars.push(charPairs[char]);
  }
  return closingChars;
};

const scoreClosingChars = R.reduce((score, x) => score * 5 + scores[x], 0);

const getLineScore = line => {
  const stack = new Stack();
  
  for(let i = 0; i < line.length; i++) {
    let char = line[i];
    if (isOpen(char)) {
      stack.push(char);
    } else if (isClose(char)) {
      let openChar = stack.pop();
      if (openMatchesClose(openChar, char)) {
        continue;
      } else {
        return 0; // corrupted
      }
    }
  }

  return scoreClosingChars(getClosingChars(stack));
}

export default R.pipe(parseInput, R.map(getLineScore), R.filter(x => x !== 0), R.sortBy(R.identity), x => x[Math.floor(x.length / 2)]);