import * as _ from 'fxjs/es';
import * as L from 'fxjs/es/Lazy';
import * as C from 'fxjs/es/Concurrency';

const log = console.log;

// if => filter, calc & assign => map, sum => reduce
const sumOdd = (list) =>
  _.go(
    list,
    L.filter((a) => a % 2),
    _.reduce(_.add)
  );
//log(sumOdd([1, 2, 3, 4, 5]));

// for, while => range
// each(f) return through input, so f() effects only inside
const whileToRange = (limit) => {
  _.go(L.range(1, limit, 2), _.each(log));
};
//whileToRange(10);

const drawStar = (limit) =>
  _.go(
    _.range(1, limit + 1), // [1, 2, 3, 4, 5]
    _.map(_.range),
    _.map(_.map(a => a = '*')),
    _.map(_.join('')), // refactor using _.join() //_.map(_.reduce(_.add)),
    _.join('\n'), //_.reduce(acc, a) => acc + '\n' + a),
  );
log(drawStar(5));
