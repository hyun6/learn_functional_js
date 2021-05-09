go(
  Promise.resolve(1),
  (a) => a + 10,
  (a) => Promise.resolve(a + 100),
  (a) => a + 1000,
  (a) => Promise.reject(Error('error')),
  (a) => a + 10000,
  log
).catch((e) => log(e));

// then(val) can get value from nested Promise
Promise.resolve(Promise.resolve(Promise.resolve(1))).then((val) =>
  log('val: ', val)
);
new Promise((resolve) => resolve(new Promise((resolve) => resolve(2)))).then((val) =>
  log('val2: ', val)
);
