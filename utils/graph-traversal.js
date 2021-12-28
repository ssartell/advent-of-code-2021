import R from 'ramda';
import m from 'mnemonist';
let { Heap, Queue, Stack } = m;

export const aStar = (start, isEnd, getNeighbors, g, h, getKey = x => x, replay) => {
    var notVisited = new Heap(R.comparator((a, b) => g(a) + h(a) <= g(b) + h(b)));
    notVisited.push(start);
    var seen = new Set();
    var costs = new Map();
    var previous = new Map();
    while(notVisited.peek() !== undefined) {
        var current = notVisited.pop();
        var key = getKey(current);
        if (seen.has(key)) {
            let cost = g(current);
            let lastCost = costs.get(key);
            if (costs.has(key) && cost < lastCost) {
                let lastTime = previous.get(key);
                replay(lastTime);
                console.log('-------------------------------------------------------------')
                replay(current);
                console.log(`${lastCost} -> ${cost}`);
                debugger;
            }
            continue;
        }
        seen.add(key);
        costs.set(key, g(current));
        previous.set(key, current);
        if (isEnd(current)) return current;
        for(var neighbor of getNeighbors(current)) {
            notVisited.push(neighbor);
        }
    }
    return null;
  };

// export const aStar = (start, isEnd, getNeighbors, g, h, getKey = x => x) => {
//     var notVisited = new Heap(R.comparator((a, b) => g(a) + h(a) <= g(b) + h(b)));
//     notVisited.push(start);
//     var seen = new Set();
//     while(notVisited.peek() !== undefined) {
//         var current = notVisited.pop();
//         var key = getKey(current);
//         if (seen.has(key)) continue;
//         seen.add(key);
//         if (isEnd(current)) return current;
//         for(var neighbor of getNeighbors(current)) {
//             notVisited.push(neighbor);
//         }
//     }
//     return null;
// };

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