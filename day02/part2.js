import R from 'ramda';

const commands = {
  'forward': ({x, y, aim}, i) => ({ x: x + i, y: y + aim * i, aim }),
  'up': ({x, y, aim}, i) => ({ x, y, aim: aim - i }),
  'down': ({x, y, aim}, i) => ({ x, y, aim: aim + i }),
};

const parseLine = R.pipe(R.split(' '), R.zipObj(['dir', 'i']), R.evolve({ i: parseInt }));
const parseInput = R.pipe(R.split('\n'), R.map(parseLine));
const calcPos = R.reduce((pos, line) => commands[line.dir](pos, line.i), { x: 0, y: 0, aim: 0 });

export default R.pipe(parseInput, calcPos, pos => pos.x * pos.y);