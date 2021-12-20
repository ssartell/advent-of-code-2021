import R from 'ramda';
import Stack from 'mnemonist/stack.js';

const debug = x => { debugger; return x; };

const toTree = num => Number.isInteger(num) ? { value: num } : [toTree(num[0]), toTree(num[1])];

const link = root => {
  root = toTree(root);
  const stack = new Stack();
  stack.push(root);
  let prev = null;
  let first = null;
  while(stack.size) {
    const node = stack.pop();
    if (Array.isArray(node)) {
      node[1].parent = node;
      node[1].index = 1;
      stack.push(node[1]);
      node[0].parent = node;
      node[0].index = 0;
      stack.push(node[0]);
    } else {
      node.prev = prev;
      if (prev) prev.next = node;
      if (!first) first = node;
      prev = node;
    }
  }
  root.first = first;
  root.last = prev;
  return root;
}

export const parseInput = R.pipe(R.split('\r\n'), R.map(JSON.parse), R.map(link));

const getDepth = num => {
  let depth = 0;
  while (num.parent) {
    depth++;
    num = num.parent;
  }
  return depth;
}

const explode = num => {
  let node = num.first;
  while(node) {
    if (getDepth(node) > 4) {
      let a = node;
      let b = node.next;
      if (a.parent === b.parent) {
        let parent = a.parent.parent;
        let i = a.parent.index;
        if (i === undefined) debugger;
        parent[i] = {
          value: 0,
          parent,
          prev: a.prev,
          next: b.next,
          index: i
        };
        if (a.prev) {
          a.prev.value += a.value;
          a.prev.next = parent[i];
        };
        if (b.next) {
          b.next.value += b.value;
          b.next.prev = parent[i];
        }
        if (num.first === a) num.first = parent[i];
        if (num.last === b) num.last = parent[i];
        return true;
      }
    }
    node = node.next;
  }
  return false;
};

const split = num => {
  let node = num.first;
  while(node) {
    if (node.value > 9) {
      let parent = node.parent;
      let i = node.index;
      let prev = node.prev;
      let next = node.next;

      let a = { value: Math.floor(node.value / 2), prev, index: 0 };
      let b = { value: Math.ceil(node.value / 2), next, index: 1 };
      if (prev) prev.next = a;
      a.next = b;
      b.prev = a;
      if (next) next.prev = b;

      let newNode = [a, b];
      a.parent = newNode;
      b.parent = newNode;
      newNode.parent = parent;
      newNode.index = i;
      parent[i] = newNode;

      if (num.first === node) num.first = a;
      if (num.last === node) num.last = b;

      return true;
    }
    node = node.next;
  }
  return false;
};

const reduce = num => {
  while(explode(num) || split(num)) { }
  return num;
};

export const add = (a, b) => {
  let root = [a, b];
  root.first = a.first;
  a.last.next = b.first;
  a.parent = root;
  a.index = 0;
  b.first.prev = a.last;
  b.parent = root;
  b.index = 1;
  root.last = b.last;
  return reduce(root);
};

const print = num => Array.isArray(num) ? `[${print(num[0])},${print(num[1])}]` : num.value;
export const magnitude = num => Array.isArray(num) ? 3 * magnitude(num[0]) + 2 * magnitude(num[1]) : num.value;

export default R.pipe(parseInput, x => R.reduce(add, R.head(x), R.tail(x)), magnitude);