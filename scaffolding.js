import R from 'ramda';
import fs from 'fs';
import { Stopwatch } from "node-stopwatch";
import ansi from "ansi";

const cursor = ansi(process.stdout);

function pad(digit, width, char) {
  char = char || '0';
  digit = digit + '';
  return digit.length >= width ? digit : new Array(width - digit.length + 1).join(char) + digit;
}

//async function run(day, part, shouldRunTests) {
export default async function run(day, part, shouldRunTests) {
  let log = 'day ' + day + ', part ' + part

  day = pad(day, 2);

  let input = fs.readFileSync('day' + day + '/input.txt', 'utf8');
  let solution = (await import('./day' + day + '/part' + part + '.js')).default;

  let stopwatch = Stopwatch.create();
  stopwatch.start();
  let answer = solution(input);
  stopwatch.stop();
  log += ' : ' + stopwatch.elapsed.seconds + 's'

  console.log(log);
  console.log(answer);
}