import R from 'ramda';
import { abs, toArray } from '../utils/vec3.js';
import { getValue, removeValue, setValue } from '../utils/map-grid-3d.js';
import { permutations } from '../utils/combinations.js';

const debug = x => { debugger; return x; };

const lineRegex = /x=(-?\d*)..(-?\d*),y=(-?\d*)..(-?\d*),z=(-?\d*)..(-?\d*)/;
const toPoints = ([x1, x2, y1, y2, z1, z2]) => [{ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }];
const parseCoords = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), toPoints);
const parseLine = R.pipe(R.split(' '), R.zipObj(['state', 'coords']), R.evolve({ coords: parseCoords }));
const parseInput = R.pipe(R.split('\r\n'), R.map(parseLine));

const applyCuboid = (grid, cuboid) => {
  let p1 = cuboid.coords[0];
  let p2 = cuboid.coords[1];
  if (R.any(x => x > 50, R.concat(toArray(abs(p1)), toArray(abs(p1))))) return grid;
  for(let z = p1.z; z <= p2.z; z++) {
    for(let y = p1.y; y <= p2.y; y++) {
      for(let x = p1.x; x <= p2.x; x++) {
        const pos = { x, y, z };
        if (cuboid.state === 'on') {
          setValue(grid, pos, 1);
        } else {
          removeValue(grid, pos);
        }
      }
    }
  }
  return grid;
}

export default R.pipe(parseInput, R.reduce(applyCuboid, new Map()), x => x.size);