import R from 'ramda';
import { min } from '../utils/ramda.js';

const parseInput = R.pipe(R.split('\r\n'), R.map(R.pipe(R.split(':'), R.last, Number)));

const diracDice = playerPos => {
  const playerScores = [0, 0];
  let dice = 0;
  let rollCount = 0;
  let rollDice = () => { 
    rollCount++;
    dice++;
    if (dice > 100) dice = 1;
    return dice;
  };
  let i = 0;
  while(R.all(x => x < 1000, playerScores)) {
    let roll = rollDice() + rollDice() + rollDice();
    playerPos[i] = ((playerPos[i] + roll - 1) % 10) + 1;
    playerScores[i] += playerPos[i];
    i = (i + 1) % 2;
  }
  return min(playerScores) * rollCount;
}

export default R.pipe(parseInput, diracDice);