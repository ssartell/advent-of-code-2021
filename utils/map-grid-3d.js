import R from 'ramda';
import { toString, fromString } from './vec3.js';
import { min, max } from './ramda.js';

// export const getNeighbors = R.curry((grid, pos) => {
//   const neighbors = [];
//   for(let y = -1; y <= 1; y++) {
//     for(let x = -1; x <= 1; x++) {
//       if(x === 0 && y === 0) continue;
//       const neighbor = add(pos, {x, y});
//       neighbors.push(neighbor);
//     }
//   }
//   return neighbors;
// });

// export const getNeighborsAndSelf = R.curry((grid, pos) => {
//   const neighbors = [];
//   for(let y = -1; y <= 1; y++) {
//     for(let x = -1; x <= 1; x++) {
//       const neighbor = add(pos, {x, y});
//       neighbors.push(neighbor);
//     }
//   }
//   return neighbors;
// });

export const getValue = R.curry((grid, pos, defaultValue = () => undefined) => {
  const key = toString(pos);
  if (grid.has(key)) return grid.get(key);
  return defaultValue();
});

export const setValue = R.curry((grid, pos, value) => {
  grid.set(toString(pos), value);
});

export const removeValue = R.curry((grid, pos) => {
  grid.delete(toString(pos));
});

export const readValues = grid => [...grid.values()];

export const getBounds = grid => {
  let pos = [...grid.keys()].map(fromString);
  let minX = min(pos.map(x => x.x));
  let maxX = max(pos.map(x => x.x));
  let minY = min(pos.map(x => x.y));  
  let maxY = max(pos.map(x => x.y));
  let minZ = min(pos.map(x => x.z));
  let maxZ = max(pos.map(x => x.z));
  return { minX, maxX, minY, maxY, minZ, maxZ };
}