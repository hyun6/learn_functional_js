// curry is like bind
// lazy call with additional arg
const curry = (f) => (arg, ..._) =>
    _.length ? f(arg, ..._) : (..._) => f(arg, ..._);

const map = curry((f, iter) => {
    let res = [];
    for (const a of iter) {
        res.push(f(a));
    }
    return res;
});

const filter = curry((f, iter) => {
    let res = [];
    for (a of iter) {
        if (f(a)) res.push(a);
    }
    return res;
});

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