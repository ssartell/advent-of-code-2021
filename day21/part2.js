import R from 'ramda';
import { max } from '../utils/ramda.js';
import { permutations } from '../utils/combinations.js';

const parseInput = R.pipe(R.split('\r\n'), R.map(R.pipe(R.split(':'), R.last, Number)));

const getKey = (a, b, c, d) => `${a}-${b}-${c}-${d}`;
const diracDice = R.memoizeWith(getKey, (p1Pos, p2Pos, p1Score, p2Score) => {
  let wins = [0, 0];
  for(let [d1, d2, d3] of permutations(3, [1,2,3])) {
    let newP1Pos = (p1Pos + d1 + d2 + d3 - 1) % 10 + 1;
    let newP1Score = p1Score + newP1Pos;
    if (newP1Score >= 21) {
      wins[0]++;
    } else {
      let futureWins = diracDice(p2Pos, newP1Pos, p2Score, newP1Score);
      wins[0] += futureWins[1];
      wins[1] += futureWins[0];
    }
  }
  return wins;
});

export default R.pipe(parseInput, ([a, b]) => diracDice(a, b, 0, 0), max);