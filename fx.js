const log = console.log;
const isIterable = (iter) => iter && iter[Symbol.iterator];

// curry is like bind
// lazy call with additional arg
const curry = (f) => (arg, ..._) =>
  _.length ? f(arg, ..._) : (..._) => f(arg, ..._);

// go with handle first arg Promise case
const go1 = (a, f) => a instanceof Promise ? (log('go1:promise'),a.then(f)) : (log('go1'),f(a));

const reduce = curry((f, acc, iter) => {
  if (iter === undefined) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value; // iter.next() has {done, value}
  }
  // step3: using go1() for first param is Promise case
  return go1(acc, function recur(acc) {
    for (const a of iter) {
        acc = f(acc, a);
        if (acc instanceof Promise) {log('recur:promise'); return acc.then(recur)};
        log('recur');
      }
      return acc;
  });

  // step2: immediately run named function
  /*
  return function recur(acc) {
    for (const a of iter) {
        acc = f(acc, a);
        if (acc instanceof Promise) return acc.then(recur);
      }
      return acc;
  }(acc);
  */
  // step1: using Promise.then() but causing promise chaining
  /*
  for (const a of iter) {
    acc = acc instanceof Promise ? acc.then(acc => f(acc, a)) : f(acc, a);
    // acc = f(acc, a);
    log(acc instanceof Promise);
  }
  return acc;
  */
});

const go = (...args) => reduce((a, f) => f(a), args);

// basic pipe return function (a) => go(a, ...fs)
const simple_pipe = (...fs) => (a) => go(a, ...fs);

// first function can have multiple args
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

const take = curry((l, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(a);
    if (res.length === l) return res;
  }
  return res;
});

// iterable (collection) driven development
// L's functions return iterable
const L = {};
L.range = function* (l) {
  let i = -1;
  while ((++i, i < l)) {
    yield i;
  }
};

// curry for last iter arg omitted in go, pipe..
L.map = curry(function* (f, iter) {
  for (const a of iter) {
    yield f(a);
  }
});

L.filter = curry(function* (f, iter) {
  for (const a of iter) {
    if (f(a)) yield a;
  }
});

// obj to iter
// obj = {k: v, k2, v2, ...} ==> [[k, v], [k2, v2], ...]
L.entries = function* (obj) {
  for (const k in obj) yield [k, obj[k]];
};

L.flatten = function* (iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* a;
    else yield a;
  }
};

L.deepFlatten = function* f(iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* f(a);
    else yield a;
  }
};

const takeAll = take(Infinity);

const map = curry(pipe(L.map, takeAll));

const filter = curry(pipe(L.filter, takeAll));

const flatten = pipe(L.flatten, takeAll);
