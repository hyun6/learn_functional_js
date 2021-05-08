

const isIterable = (iter) => iter && iter[Symbol.iterator];

// curry is like bind
// lazy call with additional arg
const curry = (f) => (arg, ..._) =>
    _.length ? f(arg, ..._) : (..._) => f(arg, ..._);

const reduce = curry((f, acc, iter) => {
    if (iter === undefined) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value; // iter.next() has {done, value}
    }

    for (const a of iter) {
        acc = f(acc, a);
    }
    return acc;
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
L.entries = function *(obj) {
    for (const k in obj) yield [k, obj[k]]
}

L.flatten = function *(iter) {
    for (const a of iter) {
        if (isIterable(a)) yield *a;
        else yield a;
    }
}

L.deepFlatten = function *f(iter) {
    for (const a of iter) {
        if (isIterable(a)) yield *f(a);
        else yield a;
    }
}

const takeAll = take(Infinity);

const map = curry(pipe(
    L.map,
    takeAll
));

const filter = curry(pipe(
    L.filter,
    takeAll
));

const flatten = pipe(
    L.flatten,
    takeAll
)