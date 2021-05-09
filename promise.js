// go(
//   Promise.resolve(1),
//   (a) => a + 10,
//   (a) => Promise.resolve(a + 100),
//   (a) => a + 1000,
//   (a) => Promise.reject(Error('error')),
//   (a) => a + 10000,
//   log
// ).catch((e) => log(e));

// // then(val) can get value from nested Promise
// Promise.resolve(Promise.resolve(Promise.resolve(1))).then((val) =>
//   log('val: ', val)
// );
// new Promise((resolve) =>
//   resolve(new Promise((resolve) => resolve(2)))
// ).then((val) => log('val2: ', val));

// go(
//   [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
//   L.map((a) => a * a),
//   take(3),
//   log
// );

// go(
//   [4, 5, 6],
//   L.map((a) => a * a),
//   take(2),
//   log
// );

// go(
//   [Promise.resolve(7), Promise.resolve(8), Promise.resolve(9)],
//   map((a) => a * a),
//   log
// );

// go(
//   [2, 3, 4],
//   map((a) => a * a),
//   log
// );

go(
    [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
    L.map((a) => a * a),
    L.filter(a => a % 2), // filtered values not run into bellow functions until take()
    L.map((a) => a + 10),
    L.map((a) => a + 10),
    L.map((a) => a + 10),
    take(3),
    log
  );
