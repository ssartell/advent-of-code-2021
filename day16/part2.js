import R from 'ramda';
import { parseInput, readPacket } from './part1.js';
import { min, max } from '../utils/ramda.js';

const execute = packet => {
  const values = R.map(x => execute(x), packet.subPackets);
  if (packet.type === 0) {
    return R.sum(values);
  } else if (packet.type === 1) {
    return R.product(values);
  } else if (packet.type === 2) {
    return min(values);
  } else if (packet.type === 3) {
    return max(values);
  } else if (packet.type === 4) {
    return packet.value;
  } else if (packet.type === 5) {
    return values[0] > values[1] ? 1 : 0;
  } else if (packet.type === 6) {
    return values[0] < values[1] ? 1 : 0;
  } else if (packet.type === 7) {
    return values[0] === values[1] ? 1 : 0;
  }
  return 0;
}

export default R.pipe(parseInput, readPacket(0), R.head, execute);