import R from 'ramda';
import m from 'mnemonist';
let { Heap, Queue, Stack } = m;

export const aStar = (start, isEnd, getNeighbors, g, h, getKey = x => x) => {
    var notVisited = new Heap(R.comparator((a, b) => g(a) + h(a) <= g(b) + h(b)));
    notVisited.push(start);
    var seen = new Set();
    while(notVisited.peek() !== undefined) {
        var current = notVisited.pop();
        var key = getKey(current);
        if (seen.has(key)) continue;
        seen.add(key);
        if (isEnd(current)) return current;
        for(var neighbor of getNeighbors(current)) {
            notVisited.push(neighbor);
        }
    }
};

export const bfs = (start, isEnd, getNeighbors, getKey = x => x) => {
  var notVisited = new Queue();
  notVisited.enqueue(start);
  var seen = new Set();
  while(notVisited.peek() !== undefined) {
      var current = notVisited.dequeue();
      var key = getKey(current);
      if (seen.has(key)) continue;
      seen.add(key);
      if (isEnd(current)) 
        return current;
      for(var neighbor of getNeighbors(current)) {
          notVisited.enqueue(neighbor);
      }
  }
};

export const dfs = (start, isEnd, getNeighbors, getKey = x => x) => {
  var notVisited = new Stack();
  notVisited.push(start);
  var seen = new Set();
  while(notVisited.peek() !== undefined) {
      var current = notVisited.pop();
      var key = getKey(current);
      if (seen.has(key)) continue;
      seen.add(key);
      if (isEnd(current)) return current;
      for(var neighbor of getNeighbors(current)) {
          notVisited.push(neighbor);
      }
  }
};

export const dijkstra = (start, isEnd, getNeighbors, getCost, getKey = x => x) => {
  var notVisited = new Heap(R.comparator((a, b) => getCost(a) <= getCost(b)));
  notVisited.push(start);
  var seen = new Set();
  while(notVisited.peek() !== undefined) {
      var current = notVisited.pop();
      var key = getKey(current);
      if (seen.has(key)) continue;
      seen.add(key);
      if (isEnd(current)) return current;
      for(var neighbor of getNeighbors(current)) {
          notVisited.push(neighbor);
      }
  }
};