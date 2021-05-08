const log = console.log;

const range = (l) => {
    let i = -1;
    let res = [];
    while ((++i, i < l)) {
        res.push(i);
    }
    return res;
};

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

const add = (acc, a) => acc + a;

const list = range(4);
log(list);

const iter_list = L.range(4);
log(reduce(add, iter_list));

// take {l} count values from iter
const take = curry((l, iter) => {
    let res = [];
    for (const a of iter) {
        res.push(a);
        if (res.length === l) return res;
    }
    return res;
});

go(take(3, range(2)), reduce(add), log);
go(take(3, L.range(5)), reduce(add), log);

const square_iter = L.map((n) => n * n, [1, 2, 3]);
log(square_iter.next());
log(square_iter.next());
log(square_iter.next());
log(square_iter.next());

const odd_iter = L.filter((n) => n % 2, [1, 2, 3, 4]);
log(odd_iter.next());
log(odd_iter.next());
log(odd_iter.next());

// run sequence
// generate function is not executed before their generated iter.next() is called
// take(iter.next()) -> filter(iter.next()) -> map(iter.next()) -> range(yield i) -> map -> filter -> take ...
go(
    L.range(10),
    L.map((n) => n + 10),
    L.filter((n) => n % 2),
    take(3),
    log
);

// L.range() is little faster
// L.range()'s pros is lazy evaluation
const test = (name, times, f) => {
    console.time(name);

    while (--times) f();

    console.timeEnd(name);
};

//test("range", 10, () => reduce(add, range(10000000)));
//test("L.range", 10, () => reduce(add, L.range(10000000)));

const ES5 = () => {
    // lecture author's ES5 version code
    function fromArray(arr) {
        var i = -1,
            length = arr.length;
        return {
            next: function () {
                return ++i >= length
                    ? { done: true }
                    : { value: arr[i], done: false };
            },
        };
    }
    function map(f, iter) {
        return {
            next: function () {
                var cur = iter.next();
                return cur.done
                    ? { done: true }
                    : { value: f(cur.value), done: false };
            },
        };
    }
    var iter = map((a) => a + 10, fromArray([1, 2, 3, 4]));
    console.log(iter.next()); // { value: 11, done: false }
    console.log(iter.next()); // { value: 12, done: false }
    console.log(iter.next()); // { value: 13, done: false }
    console.log(iter.next()); // { value: 14, done: false }
    console.log(iter.next()); // { done: true }

    function filter(f, iter) {
        return {
            next: function () {
                var cur = iter.next();
                return cur.done
                    ? { done: true }
                    : f(cur.value)
                    ? { value: cur.value, done: false }
                    : this.next();
            },
        };
    }

    var iter2 = filter((a) => a % 2, fromArray([1, 2, 3]));
    console.log(iter2.next()); // { value: 1, done: false }
    console.log(iter2.next()); // { value: 3, done: false }
    console.log(iter2.next()); // { done: true }

    function take(l, iter) {
        var i = -1,
            res = [];
        while (++i < l) {
            var cur = iter.next();
            if (cur.done) break;
            res.push(cur.value);
        }
        return res;
    }

    console.log(
        take(
            2,
            filter(
                (a) => a % 2,
                map((a) => a + 10, fromArray([1, 2, 3, 4, 5]))
            )
        )
    );
};
// [11, 13] map의 next에는 3번만.
