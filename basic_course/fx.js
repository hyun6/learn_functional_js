const log = console.log;
const isIterable = (iter) => iter && iter[Symbol.iterator];

// curry is like bind
// lazy call with additional arg
const curry = (f) => (arg, ..._) =>
  _.length ? f(arg, ..._) : (..._) => f(arg, ..._);

// go with handle first arg Promise case
const go1 = (a, f) => (a instanceof Promise ? a.then(f) : f(a));

const reduce = curry((f, acc, iter) => {
  if (iter === undefined) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value; // iter.next() has {done, value}
  }
  // step3: using go1() for first param is Promise case
  return go1(acc, function recur(acc) {
    let cur;
    // for...of has iterator.return() statement in case of generator function ended
    // ref: https://www.inflearn.com/questions/17067
    while ((cur = iter.next()).done === false) {
      const a = cur.value;
      acc = f(acc, a);
      if (acc instanceof Promise) {
        return acc.then(recur);
      }
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
  // promise chaining to recursive function
  return (function recur() {
    let cur;
    while ((cur = iter.next()).done === false) {
      const a = cur.value;
      if (a instanceof Promise) {
        return a
          .then((a) => {
            res.push(a);
            return res.length === l ? res : recur();
          })
          .catch((e) => (e === nop ? recur() : Promise.reject(e)));
      }
      res.push(a);
      if (res.length === l) return res;
    }
    return res;
  })();
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
    yield go1(a, f);
  }
});

const nop = Symbol('nop');
L.filter = curry(function* (f, iter) {
  for (const a of iter) {
    const b = go1(a, f);
    if (b instanceof Promise) {
      // unpack promise value
      // if false, using Promise.reject() for prevent no more map(), reduce()... sequence
      yield b.then((b) => (b ? a : Promise.reject(nop)));
    } else {
      if (b) yield a;
    }
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

// find first filtered item
const find = (f, iter) =>
  go(
    iter,
    L.filter(f), // L.filter() evaluate until find item but filter() evaluate all iter
    take(1),
    ([a]) => a // array to obj
  );

const range = (l) => {
  let i = -1;
  let res = [];
  while ((++i, i < l)) {
    res.push(i);
  }
  return res;
};
