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
L.flatMap = curry(pipe(L.map, L.flatten));

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

// 2D array with lazy flatten
log("2D array");
const arr = [
    [1, 2, 3],
    [4, 5],
    [6, 7, 8],
    [9, 10],
];

go(
    arr,
    flatten,
    map((a) => (log(a), a)), // iterate all items
    filter((a) => a % 2),
    take(3),
    log
);

go(
    arr,
    L.flatten,
    L.map((a) => (log(a), a)), // iterate only necessary items
    L.filter((a) => a % 2),
    take(3),
    log
);

// real world example
log('real world example');

var realUsers = [
    {
        name: "a",
        age: 21,
        family: [
            { name: "a1", age: 53 },
            { name: "a2", age: 47 },
            { name: "a3", age: 16 },
            { name: "a4", age: 15 },
        ],
    },
    {
        name: "b",
        age: 24,
        family: [
            { name: "b1", age: 58 },
            { name: "b2", age: 51 },
            { name: "b3", age: 19 },
            { name: "b4", age: 22 },
        ],
    },
    {
        name: "c",
        age: 31,
        family: [
            { name: "c1", age: 64 },
            { name: "c2", age: 62 },
        ],
    },
    {
        name: "d",
        age: 20,
        family: [
            { name: "d1", age: 42 },
            { name: "d2", age: 42 },
            { name: "d3", age: 11 },
            { name: "d4", age: 7 },
        ],
    },
];

// iterable programming pattern: (data), [map, filter, flatten ...], [take, reduce ...], ...
go(
    realUsers,
    // L.map(u => u.family),
    // L.flatten,
    L.flatMap((u) => u.family), // map, flatten === flatMap
    L.filter((u) => u.age > 20),
    L.map((u) => u.age),
    take(4),
    reduce((acc, age) => acc + age),
    log
);
