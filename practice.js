const log = console.log

// join for iterable/generator
const join = curry((sep = ',', iter) => reduce((acc, a) => acc + sep + a, iter))

// query string maker
const queryStr = pipe(
    L.entries,
    a => {log(a); return a;},
    L.map(([k, v]) => `${k}=${v}`),
    //reduce((a, b) => `${a}&${b}`),
    join('&')
)
const queryStrRes = queryStr({key1: 'val1', key2: 'val2', key3: 3});
log(queryStrRes);