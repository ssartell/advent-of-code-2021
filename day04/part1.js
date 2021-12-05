import R from 'ramda';

const parseNumbers = R.pipe(R.trim, R.split(/[,\s]+/), R.map(parseInt));
const parseBoards  = R.map(R.pipe(R.split('\r\n'), R.map(parseNumbers), x => ({ numbers: x, marked: Array(5).fill().map(() => Array(5).fill(0))})));
const parseInput = R.pipe(R.split('\r\n\r\n'), ([a, ...b]) => ({ numbers: parseNumbers(a), boards: parseBoards(b) }));

const sumUnmarked = (board) => {
  let sum = 0;
  for(let i = 0; i < 5; i++) {
    for(let j = 0; j < 5; j++) {
      if(board.marked[i][j] === 0) {
        sum += board.numbers[i][j];
      }
    }
  }
  return sum;
}

const playBingo = ({ numbers, boards }) => {
  for(let num of numbers) {
    for(let board of boards) {
      for(let i = 0; i < 5; i++) {
        let rowSum = 0;
        let colSum = 0;
        for(let j = 0; j < 5; j++) {
          if(board.numbers[i][j] === num) {
            board.marked[i][j] = 1;
          }
          if(board.numbers[j][i] === num) {
            board.marked[j][i] = 1;
          }
          rowSum += board.marked[i][j];
          colSum += board.marked[j][i];
        }
        if (rowSum === 5 || colSum === 5) {
          return sumUnmarked(board) * num;
        }
      }
    }
  }
};

export default R.pipe(parseInput, playBingo);