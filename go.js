const log = console.log;

// go can help code readability (top -> bottom code flow)
// first: arg
// ...rest: function sequences
const go = (...args) => reduce((a, f) => f(a), args);

// equal expression with go(arg, f1, f2, f3...);
const easy_go = (arg, ...fs) => reduce((a, f) => f(a), arg, fs);

// basic pipe return function (a) => go(a, ...fs)
const pipe = (...fs) => (a) => go(a, ...fs);

// first function can have multiple args
const pipe2 = (f, ...fs) => (...as) => go(f(...as), ...fs);

go(
    0,
    (a) => a + 1,
    (a) => a + 10,
    (a) => a + 100,
    log
);

const fs = pipe(
    (a) => a + 1,
    (a) => a + 10,
    (a) => a + 100,
    log
);
fs(0);

const firstFn = (...args) => reduce((acc, a) => acc + a, args);
const fs2 = pipe2(
    firstFn,
    (a) => a + 10,
    (a) => a + 100,
    log
);
fs2(7, 9, 4, 5); // pipe2(f, ...fs)([7, 9, 4, 5] => go(firstFn([7,9,4,5]), ...fs));

// refactoring from map.html example
const products = [
    { name: "아이패드", price: 1000 },
    { name: "맥미니", price: 1500 },
    { name: "맥북", price: 1700 },
];

// read from bottom, right to top, left
// log(
//     reduce(
//         adder,
//         0,
//         filter(price => price > 1000,
//             map(p => p.price, products)
//         )
//     )
// );

// read from top, left to bottom, right
// top return to bottom input
go(
    products,
    (products) => map((p) => p.price, products),
    (prices) => filter((price) => price > 1000, prices),
    (prices) => reduce((total_price, price) => total_price + price, prices),
    log
);

// simplification by curry
// step1: fn = curry(f, iter) ===> fn(f)(iter);
go(
    products,
    (products) => map((p) => p.price)(products),
    (prices) => filter((price) => price > 1000)(prices),
    (prices) => reduce((total_price, price) => total_price + price)(prices),
    log
)

// step2: iter => fn(f)(iter) ===> fn(f)
// author explanation: a => f(a) 라는 함수는 그냥 f와 하는 일이 같습니다.
//  - a: iter, f: fn(f)
go(
    products,
    map((p) => p.price),
    filter((price) => price > 1000),
    reduce((total_price, price) => total_price + price),
    log
);

// step3: divide with pipe + go combination
const total_price = pipe(
    map((p) => p.price),
    reduce((total_price, price) => total_price + price),
);
const total_price_cond = cond => pipe(
    filter(cond),
    total_price,
);
go(
    products,
    total_price_cond((p) => p.price > 1000),
    log
)

// move to fx.js
// curry is like bind
// lazy call with additional arg
// const curry = (f) => (arg, ..._) =>
//     _.length ? f(arg, ..._) : (..._) => f(arg, ..._);

const add = curry((a, b) => a + b);
const add10 = add(10);
log(add10(3)); // 13
log(add(10)(3));

// more explanation
const add1 = (a) => a + 1;
const f1 = (a) => add1(a);
const f2 = add1;
// 위 3개의 함수에 3을 넣으면 모두 4가 나올 것이다. 라는 설명입니다.

// 도전 과제: 아래 조건을 만족시키는 curry 구현 (hint 재귀)
const curry2 = (f) =>
    (curried = (...args) => {
        return args.length >= f.length
            ? f(...args)
            : (...rest) => curried(...args, ...rest); // recursive call with concat all args
    });

// get args length from function
const ff = (a, b, c) => a + b + c;
log(ff.length);

const c_add = curry2((a, b, c) => a + b + c);
log(c_add(1, 2, 3));
log(c_add(1)(2, 3));
log(c_add(1, 2)(3));
log(c_add(1)(2)(5));
