export default function* (list, n) {
    var keys = [];
    var index = 0;
    for (var i = 0; i < n; i++) {
      keys.push(-1);
    }
    while (index >= 0) {
      if (keys[index] < list.length - (n - index)) {
        for (var key = keys[index] - index + 1; index < n; index++) {
          keys[index] = key + index;
        }
        yield keys.map(x => list[x]);
      } else {
        index--;
      }
    }
  };