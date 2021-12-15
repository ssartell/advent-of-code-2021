import R from 'ramda';
import { min, max } from '../utils/ramda.js';

const parseRules = R.pipe(R.split('\r\n'), R.map(R.split(' -> ')), R.fromPairs);
export const parseInput = R.pipe(R.split('\r\n\r\n'), R.zipObj(['template', 'rules']), R.evolve({ rules: parseRules }));

const getCounts = str => {
  const counts = {};
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    counts[ch] = (counts[ch] || 0) + 1;
  }
  return counts;
};

const key = (rules, str, depth) => str + depth;
const run = R.memoizeWith(key, (rules, str, depth) => {
  if (depth < 0) {
    return getCounts(str);
  }
  const rule = rules[str];
  const part1 = run(rules, str[0] + rule, depth - 1);
  const part2 = run(rules, rule + str[1], depth - 1);
  const counts = R.mergeWith(R.add, part1, part2);
  counts[rule]--;
  return counts;
});

export const split = (rules, template, depth) => {
  let counts = {};
  let pairs = R.aperture(2, R.split('', template));
  for(let pair of pairs) {
    counts = R.mergeWith(R.add, counts, run(rules, pair[0] + pair[1], depth - 1));
    counts[pair[1]]--;
  }
  let lastChar = R.last(template);
  counts[lastChar]++;
  return counts;
}

export default R.pipe(parseInput, x => split(x.rules, x.template, 10), R.values, R.converge(R.subtract, [max, min]));