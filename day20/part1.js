import R from 'ramda';
import { setValue, getValue, getBounds, getNeighborsAndSelf } from '../utils/map-grid.js';

const debug = x => { debugger; return x; };

const toMapGrid = arr => {
  const grid = new Map();
  for(let y = 0; y < arr.length; y++) {
    for(let x = 0; x < arr[y].length; x++) {
      if (arr[y][x] === '#')
        setValue(grid, { x, y }, arr[y][x]);
    }
  }
  return grid;
}
const parseImage = R.pipe(R.split('\r\n'), R.map(R.split('')), toMapGrid);
export const parseInput = R.pipe(R.split('\r\n\r\n'), R.zipObj(['algo', 'image']), R.evolve({ image: parseImage }));

const enhance = (algo, image, i) => {
  let newImage = new Map();
  let bounds = getBounds(image);
  for(let y = bounds.minY - 1; y <= bounds.maxY + 1; y++) {
    for(let x = bounds.minX - 1; x <= bounds.maxX + 1; x++) {
      const pos = { x, y };
      const neighbors = getNeighborsAndSelf(image, pos);
      const index = neighbors.reduce((acc, n) => {
        const defaultValue = () => (n.x < bounds.minX || n.x > bounds.maxX || n.y < bounds.minY || n.y > bounds.maxY) && i % 2 === 0 ? R.head(algo) : R.last(algo)
        const value = getValue(image, n, defaultValue);
        return value === '#' ? (acc << 1) | 1 : (acc << 1)
      }, 0);
      if (!Number.isInteger(index)) debugger;
      if (index < 0) debugger;
      if (index >= 512) debugger;
      const value = algo[index];
      if (value === '#')
        setValue(newImage, pos, '#');
    }
  }
  return newImage;
};

const print = image => {
  let bounds = getBounds(image);
  let output = '';
  for(let y = bounds.minY; y <= bounds.maxY; y++) {
    for(let x = bounds.minX; x <= bounds.maxX; x++) {
      const pos = { x, y };
      const value = getValue(image, pos);
      output += value === '#' ? '#' : '.';
    }
    output += '\r\n';
  }
  console.log(output);
};

export const applyAlgo = R.curry((n, {algo, image}) => {
  // console.log(0);
  // print(image);
  for(let i = 1; i <= n; i++) {
    // console.log(i);
    image = enhance(algo, image, i);
    // print(image);
  }
  return image;
});

export default R.pipe(parseInput, applyAlgo(2), x => x.size);