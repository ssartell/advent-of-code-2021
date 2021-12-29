import R from 'ramda';

const debug = x => { debugger; return x; };

const lineRegex = /(\S+) (\S+) ?(\S+)?/;
const tryParseInt = x => isNaN(parseInt(x)) ? x : parseInt(x);
const parseLine = R.pipe(R.match(lineRegex), R.tail, R.map(tryParseInt), R.zipObj(['instruction', 'a', 'b']));
const parseInput = R.pipe(R.split('\r\n'), R.map(parseLine));

const exec = R.curry((readInput, program) => {
  let state = {
    w: 0,
    x: 0,
    y: 0,
    z: 0,
  };
  for(let line of program) {
    switch (line.instruction) {
      case 'inp':
        state[line.a] = readInput();
        break;
      case 'add':
        state[line.a] = state[line.a] + (state[line.b] ?? line.b);
        break;
      case 'mul':
        state[line.a] = state[line.a] * (state[line.b] ?? line.b);
        break;
      case 'div':
        state[line.a] = Math.floor(state[line.a] / (state[line.b] ?? line.b));
        break;
      case 'mod':
        state[line.a] = state[line.a] % (state[line.b] ?? line.b);
        break;
      case 'eql':
        state[line.a] = state[line.a] === (state[line.b] ?? line.b) ? 1 : 0;
        break;
    }
  }
  return state;
});

let exec2 = R.curry((readInput, program) => {
  let w = 0;
  let x = 0;
  let y = 0;
  let z = 0;
  w = readInput();
  x = ((z % 26) + 14 !== w) ? 1 : 0;
  z = (25 * x + 1) * Math.floor(z / 1) + (w + 0) * x;
  //debugger;
  w = readInput();
  x = ((z % 26) + 13 !== w) ? 1 : 0;
  z = (25 * x + 1) * Math.floor(z / 1) + (w + 12) * x;
  //debugger;
  w = readInput();
  x = ((z % 26) + 15 !== w) ? 1 : 0;
  z = (25 * x + 1) * Math.floor(z / 1) + (w + 14) * x;
  //debugger;
  w = readInput();
  x = ((z % 26) + 13 !== w) ? 1 : 0;
  z = (25 * x + 1) * Math.floor(z / 1) + (w + 0) * x;
  //debugger;
  w = readInput();
  x = ((z % 26) + -2 !== w) ? 1 : 0;
  z = (25 * x + 1) * Math.floor(z / 26) + (w + 3) * x;
  //debugger;
  w = readInput();
  x = ((z % 26) + 10 !== w) ? 1 : 0;
  z = (25 * x + 1) * Math.floor(z / 1) + (w + 15) * x;
  //debugger;
  w = readInput();
  x = ((z % 26) + 13 !== w) ? 1 : 0;
  z = (25 * x + 1) * Math.floor(z / 1) + (w + 11) * x;
  //debugger;
  w = readInput();
  x = ((z % 26) + -15 !== w) ? 1 : 0;
  z = (25 * x + 1) * Math.floor(z / 26) + (w + 12) * x;
  //debugger;
  w = readInput();
  x = ((z % 26) + 11 !== w) ? 1 : 0;
  z = (25 * x + 1) * Math.floor(z / 1) + (w + 1) * x;
  //debugger;
  w = readInput();
  x = ((z % 26) + -9 !== w) ? 1 : 0;
  z = (25 * x + 1) * Math.floor(z / 26) + (w + 12) * x;
  //debugger;
  // not working
  w = readInput();
  x = ((z % 26) + -9 !== w) ? 1 : 0;
  z = (25 * x + 1) * Math.floor(z / 26) + (w + 3) * x;
  //debugger;
  w = readInput();
  x = ((z % 26) + -7 !== w) ? 1 : 0;
  z = (25 * x + 1) * Math.floor(z / 26) + (w + 10) * x;
  //debugger;
  w = readInput();
  x = ((z % 26) + -4 !== w) ? 1 : 0;
  z = (25 * x + 1) * Math.floor(z / 26) + (w + 14) * x;
  // debugger;
  w = readInput();
  x = ((z % 26) + -6 !== w) ? 1 : 0;
  z = (25 * x + 1) * Math.floor(z / 26) + (w + 12) * x;
  // debugger;
  return z;
});

let input = [9,1,2, 9,7, 3, 9,5, 9,1, 9,9,9,3];
export default R.pipe(parseInput, exec2(() => input.shift()), debug);