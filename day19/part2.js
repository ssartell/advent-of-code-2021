import R from 'ramda';
import { rotateAroundX90, rotateAroundY90, rotateAroundZ90, sub, add, equal, manhattan, toString } from '../utils/vec3.js';
import { max } from '../utils/ramda.js';
import { bfs } from '../utils/graph-traversal.js';

const debug = x => { debugger; return x; };

const dirs = [
  R.identity,
  rotateAroundZ90,
  R.pipe(rotateAroundZ90, rotateAroundZ90),
  R.pipe(rotateAroundZ90, rotateAroundZ90, rotateAroundZ90),
  rotateAroundX90,
  R.pipe(rotateAroundX90, rotateAroundX90, rotateAroundX90),
];

const dirRotations = [
  rotateAroundY90,
  rotateAroundX90,
  rotateAroundY90,
  rotateAroundX90,
  rotateAroundZ90,
  rotateAroundZ90
];

const parseCoords = R.pipe(R.split(','), R.map(Number), R.zipObj(['x', 'y', 'z']));
const parseScanner = R.pipe(R.split('\r\n'), R.tail, R.map(parseCoords));
const parseInput = R.pipe(R.split('\r\n\r\n'), R.map(parseScanner));

const allOrientations = v => {
  const all = [];
  for(let i = 0; i < 6; i++) {
    let v2 = dirs[i](v);
    for(let j = 0; j < 4; j++) {
      all.push(v2);
      v2 = dirRotations[i](v2);
    }
  }
  return all;
};

const allPairs = beacons => {
  const all = [];
  for(let i = 0; i < beacons.length; i++) {
    for(let j = i + 1; j < beacons.length; j++) {
      all.push({ a: beacons[i], b: beacons[j]});
    }
  }
  return all;
};

const findRotation = overlap => {
  const bestDir = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
  const bestRot = {0: 0, 1: 0, 2: 0, 3: 0};
  for(let match of overlap.matches) {
    let d1 = sub(match.edge1.a, match.edge1.b);
    let d2 = sub(match.edge2.a, match.edge2.b);
    for(let d = 0; d < 6; d++) {
      let dir = dirs[d];
      let dirRot = dirRotations[d];
      let v = dir(d2);
      for(let i = 0; i < 4; i++) {
        if (equal(d1, v)) {
          bestDir[d]++;
          bestRot[i]++;
        }
        v = dirRot(v);
      }
    }
  }
  const dir = Object.keys(bestDir).reduce((a, b) => bestDir[a] > bestDir[b] ? a : b);
  const rot = Object.keys(bestRot).reduce((a, b) => bestRot[a] > bestRot[b] ? a : b);
  return x => {
    let v = dirs[dir](x);
    for(let i = 0; i < rot; i++) {
      v = dirRotations[dir](v);
    }
    return v;
  }
};

const findTranslation = (overlap, rotation) => {
  let bestTranslation = {};
  let translations = {};
  for(let match of overlap.matches) {
    let d1 = sub(match.edge1.a, rotation(match.edge2.a));
    bestTranslation[toString(d1)] = (bestTranslation[toString(d1)] || 0) + 1;
    translations[toString(d1)] = translations[toString(d1)] || (x => add(x, d1));
  }

  const best = Object.keys(bestTranslation).reduce((a, b) => bestTranslation[a] > bestTranslation[b] ? a : b);
  return translations[best];
}

const findOverlaps = scanners => {
  let overlaps = [];
  for(let s of scanners) {
    s.pairs = allPairs(s);
  }
  for(let i = 0; i < scanners.length; i++) {
    for(let j = 0; j < scanners.length; j++) {
      if (i === j) continue;
      const s1 = scanners[i];
      const s2 = scanners[j];
      let matches = [];
      for(let edge1 of s1.pairs) {
        for(let edge2 of s2.pairs) {
          if (manhattan(sub(edge1.a, edge1.b)) === manhattan(sub(edge2.a, edge2.b))) {
            matches.push({edge1, edge2});
          }
        }
      }
      if (matches.length >= 12 * 11 / 2) {
        overlaps.push({i, j, matches});
      }
    }
  }

  for(let overlap of overlaps) {
    let rotation = findRotation(overlap);
    let s1 = scanners[overlap.i];
    let s2 = scanners[overlap.j];
    let translation = findTranslation(overlap, rotation);
    overlap.transform = v => translation(rotation(v));
  }

  return overlaps;
};

const align = scanners => {
  let overlaps = findOverlaps(scanners);
  const scannerPositions = [];

  const getNeighbors = x => {
    return overlaps.filter(y => x.j === y.i)
      .map(y => ({ i: y.i, j: y.j, transform: v => x.transform(y.transform(v)) }));
  };
  const isEnd = x => {
    scannerPositions.push(x.transform({x: 0, y: 0, z: 0}));
    return false;
  }
  const getKey = x => `${x.i}-${x.j}`;
  bfs(overlaps[0], isEnd, getNeighbors, getKey);

  return max(allPairs(scannerPositions).map(x => manhattan(sub(x.a, x.b))));
};

export default R.pipe(parseInput, align);