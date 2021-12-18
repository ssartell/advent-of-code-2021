import R from 'ramda';

export const parseInput = R.pipe(R.split(''), R.map(x => parseInt(x, 16).toString(2).padStart(4, '0')), R.join(''));

export const readPacket = R.curry((i, stream) => {
  const readBits = n => {
    const bits = stream.substr(i, n);
    i += n;
    return bits;
  };
  const readInt = n => parseInt(readBits(n), 2);
  
  const packet = {
    version: readInt(3),
    type: readInt(3),
    subPackets: []
  };    

  if (packet.type === 4) {
    // literal packet
    let subPacket = '';
    while (readInt(1) === 1) {
      subPacket += readBits(4);
    }
    subPacket += readBits(4);
    packet.value = parseInt(subPacket, 2);
  } else {
    // operator packet
    const lenghtType = readInt(1);
    if (lenghtType === 0) {
      const subPacketlength = readInt(15);
      let target = i + subPacketlength;
      while (i < target) {
        let [subJacket, newIndex] = readPacket(i, stream);
        i = newIndex;
        packet.subPackets.push(subJacket);
      }
    } else if (lenghtType === 1) {
      const subPacketCount = readInt(11);
      for(let j = 0; j < subPacketCount; j++) {
        let [subJacket, newIndex] = readPacket(i, stream);
        i = newIndex;
        packet.subPackets.push(subJacket);
      }
    }
  }
  return [packet, i];
});

const sumVersions = packet => packet.version + R.sum(R.map(x => sumVersions(x), packet.subPackets));

export default R.pipe(parseInput, readPacket(0), R.head, sumVersions);