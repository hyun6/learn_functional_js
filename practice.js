const log = console.log;

// join for iterable/generator
const join = curry((sep = ",", iter) =>
    reduce((acc, a) => acc + sep + a, iter)
);

// query string maker
const queryStr = pipe(
    L.entries,
    (a) => {
        log(a);
        return a;
    },
    L.map(([k, v]) => `${k}=${v}`),
    //reduce((a, b) => `${a}&${b}`),
    join("&")
);
const queryStrRes = queryStr({ key1: "val1", key2: "val2", key3: 3 });
log(queryStrRes);

// find first filtered item
const find = (f, iter) =>
    go(
        iter,
        L.filter((a) => (log(a), f(a))), // L.filter() evaluate until find item but filter() evaluate all iter
        (a) => (log(a), a), // log for see iterated item
        take(1),
        ([u]) => u // array to obj
    );

const users = [{ age: 18 }, { age: 21 }, { age: 23 }, { age: 21 }, { age: 37 }];

log(find((u) => u.age === 23, users));

// test flatten
log(flatten([1, [2, 3, 4], 5, 6]));
log(take(3, L.flatten([1, [2, [3, 4]], 5, 6])));
log(take(5, L.deepFlatten([1, [2, [3, 4]], 5, 6])));

// js Array.flatMap
log(
    [
        [1, 2],
        [3, 4],
        [5, 6, 7],
    ].flatMap((a) => (log(a), a))
);
log(
    [
        [1, 2],
        [3, 4],
        [5, 6, 7],
    ].flatMap((a) => a.map((a) => a * a))
);

// flatMap with iterable
L.flatMap = pipe(L.map, L.flatten);

// make flatMap
const flatMap = curry(pipe(L.map, flatten));

let it = L.flatMap((a) => a, [
    [1, 2],
    [3, 4],
    [5, 6, 7],
]);
log([...it]);
// log(it.next());
// log(it.next());

log(
    flatMap((a) => a, [
        [1, 2],
        [3, 4],
        [5, 6, 7],
    ])
);

log(
    flatMap(
        L.range,
        map((a) => a + 1, [1, 2, 3])
    )
);

it = L.flatMap(
    L.range,
    map((a) => a + 1, [1, 2, 3])
);
log(it.next());
log(it.next());
log(it.next());
log(it.next());

log(
    take(
        3,
        L.flatMap(
            L.range,
            map((a) => a + 1, [1, 2, 3])
        )
    )
);
