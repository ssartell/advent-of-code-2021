import R from 'ramda';

const commands = {
  'forward': ({x, y}, i) => ({ x: x + i, y }),
  'up': ({x, y}, i) => ({ x, y: y - i }),
  'down': ({x, y}, i) => ({ x, y: y + i }),
};

const parseLine = R.pipe(R.split(' '), R.zipObj(['dir', 'i']), R.evolve({ i: parseInt }));
const parseInput = R.pipe(R.split('\n'), R.map(parseLine));
const calcPos = R.reduce((pos, cmd) => commands[cmd.dir](pos, cmd.i), { x: 0, y: 0 });

export default R.pipe(parseInput, calcPos, pos => pos.x * pos.y);