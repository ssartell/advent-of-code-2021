import R from 'ramda';

const parseLine = R.pipe(R.split(' | '), R.map(R.split(' ')), R.zipObj(['input', 'output']));
const parseInput = R.pipe(R.split('\r\n'), R.map(parseLine));

export default R.pipe(parseInput, R.map(x => x.output.map(x => [2,4,3,7].includes(x.length))), R.flatten, R.sum);