import R from 'ramda';
import { min, max } from '../utils/ramda.js';

const parseRules = R.pipe(R.split('\r\n'), R.map(R.split(' -> ')), R.fromPairs);
export const parseInput = R.pipe(R.split('\r\n\r\n'), R.zipObj(['template', 'rules']), R.evolve({ rules: parseRules }));

export const expandPolymer = R.memoizeWith(
  (rules, str, depth) => str + depth, 
  (rules, str, depth) => {
    if (depth === 0) return R.countBy(R.identity, str);
    let pairs = R.aperture(2, R.split('', str)).map(R.join(''));
    let counts = R.reduce((counts, pair) => {
      const rule = rules[pair];
      const part1 = expandPolymer(rules, pair[0] + rule, depth - 1);
      const part2 = expandPolymer(rules, rule + pair[1], depth - 1);
      const subCounts = R.mergeWith(R.add, part1, part2);
      subCounts[rule]--;
      subCounts[pair[1]]--;     
      return R.mergeWith(R.add, counts, subCounts);
    }, {}, pairs);
    counts[R.last(str)]++;
    return counts;
  }
);

export default R.pipe(parseInput, x => expandPolymer(x.rules, x.template, 10), R.values, R.converge(R.subtract, [max, min]));