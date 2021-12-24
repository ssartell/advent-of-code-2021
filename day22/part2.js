import R from 'ramda';
import { sub, add } from '../utils/vec3.js';

const lineRegex = /x=(-?\d*)..(-?\d*),y=(-?\d*)..(-?\d*),z=(-?\d*)..(-?\d*)/;
const toPoints = ([x1, x2, y1, y2, z1, z2]) => ({ min: { x: x1, y: y1, z: z1 }, max: { x: x2, y: y2, z: z2 }});
const parseCoords = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), x => ({ ...toPoints(x)}));
const parseLine = R.pipe(R.split(' '), ([state, coords]) => ({ state, ...parseCoords(coords) }));
const parseInput = R.pipe(R.split('\r\n'), R.map(parseLine), R.addIndex(R.map)((cuboid, i) => ({ ...cuboid, i })));

const doesIntersect = (c1, c2) => 
  c1.min.x <= c2.max.x && c1.max.x >= c2.min.x &&
  c1.min.y <= c2.max.y && c1.max.y >= c2.min.y &&
  c1.min.z <= c2.max.z && c1.max.z >= c2.min.z;

const intersection = (c1, c2) => {
  let xs = R.sortBy(R.identity, [c1.min.x, c1.max.x, c2.min.x, c2.max.x]);
  let ys = R.sortBy(R.identity, [c1.min.y, c1.max.y, c2.min.y, c2.max.y]);
  let zs = R.sortBy(R.identity, [c1.min.z, c1.max.z, c2.min.z, c2.max.z]);
  return { min: { x: xs[1], y: ys[1], z: zs[1] }, max: { x: xs[2], y: ys[2], z: zs[2] }};
};

const volume = c => {
  let v = add(sub(c.max, c.min), { x: 1, y: 1, z: 1 });
  return v.x * v.y * v.z;
};

const count = cuboids => {
  let applied = [];
  for(let c1 of cuboids) {
    c1.volume = volume(c1);    
    let overlaps = [];
    for(let c2 of applied) {
      if (!doesIntersect(c1, c2)) continue;
      let c3 = intersection(c1, c2);
      c3.volume = -Math.sign(c2.volume) * volume(c3);
      overlaps.push(c3);
    }
    applied = c1.state === 'on' ? [...applied, c1, ...overlaps] : [...applied, ...overlaps];
  }
  return R.sum(R.map(c => c.volume, applied));
};

export default R.pipe(parseInput, count);