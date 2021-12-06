import R from 'ramda';

const parsePair = R.pipe(R.split(','), R.map(parseInt), R.zipObj(['x', 'y']));
const parseLine = R.pipe(R.split(' -> '), R.map(parsePair), R.zipObj(['p1', 'p2']));
const isStraight = ({p1, p2}) => p1.x === p2.x || p1.y === p2.y;
const parseInput = R.pipe(R.split('\n'), R.map(parseLine), R.filter(isStraight));

const add = (p1, p2) => ({x: p1.x + p2.x, y: p1.y + p2.y});
const equals = (p1, p2) => p1.x === p2.x && p1.y === p2.y;

const findIntersections = lines => {
  let count = 0;
  const points = new Map();
  for(let line of lines) {
    const dir = { x: Math.sign(line.p2.x - line.p1.x), y: Math.sign(line.p2.y - line.p1.y) };
    for(let p = line.p1; !equals(p, add(line.p2, dir)); p = add(p, dir)) {
      const pk = `${p.x},${p.y}`;
      points.set(pk, points.has(pk) ? points.get(pk) + 1 : 1);
      if (points.get(pk) === 2) count++;
    }
  }
  return count;
}

export default R.pipe(parseInput, findIntersections);