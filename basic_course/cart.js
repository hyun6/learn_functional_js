const log = console.log;

const add = (acc, a) => acc + a;

const products = [
  { name: '아이패드', price: 1000, quantity: 1, is_selected: true },
  { name: '맥미니', price: 1500, quantity: 2, is_selected: true },
  { name: '맥북', price: 1700, quantity: 1, is_selected: false },
];

// calc total price
// step1
const total_price1 = (products) =>
  go(
    products,
    map((p) => p.price),
    reduce(add)
  );
log(total_price1(products));

// step2 simplification: can remove products and change go -> pipe
// pipe = (arg) => go(arg, go(...fs))
const total_price2 = pipe(
  map((p) => p.price),
  reduce(add)
);
log(total_price2(products));

// calc total quantity
// step1
const total_quantity1 = pipe(
  map((p) => p.quantity),
  reduce(add)
);
log(total_quantity1(products));

// refactoring step1: DRY
const _sum = (f, iter) => go(iter, map(f), reduce(add));
const _total_price = (products) => _sum((p) => p.price, products);
const _total_quantity = (products) => _sum((p) => p.quantity, products);

// step2: curry curry simplification (iter must last arg for curry)
const sum = curry((f, iter) => go(iter, map(f), reduce(add)));
const total_price = sum((p) => p.price);
const total_quantity = sum((p) => p.quantity);
log(total_price(products));
log(total_quantity(products));

// sum() can using general purpose
log(sum((u) => u.age, [{ age: 10 }, { age: 20 }, { age: 30 }]));

document.querySelector('#cart').innerHTML = `
<table>
    <tr>
        <th></th>
        <th>제품명</th>
        <th>가격</th>
        <th>수량</th>
        <th>총 가격</th>
    </tr>
    ${go(
      // (iter, map, reduce) pattern === sum()
      // products,
      // map(
      //     (p) =>
      // `<tr>
      //     <td>${p.name}</td>
      //     <td>${p.price}</td>
      //     <td><input type="number" value=${p.quantity}</td>
      //     <td>${p.price * p.quantity}</td>
      // </tr>`
      // ),
      // reduce(add) // reduce string from map()'s return '<tr> ... </td>' array => '<tr>...</tr><tr>...</tr>'
      products,
      sum(
        (p) =>
          `<tr>
                <td><input type="checkbox" ${
                  p.is_selected ? 'checked' : ''
                }></td>
                <td>${p.name}</td>
                <td>${p.price}</td>
                <td><input type="number" value="${p.quantity}"</td>
                <td>${p.price * p.quantity}</td>
            </tr>`
      )
    )}
    <tr>
        <td></td>
        <td>총합</td>
        <td> </td>
        <td>${total_quantity(filter((p) => p.is_selected, products))}</td>
        <td>${total_price(filter((p) => p.is_selected, products))}</td>
    </tr>
</table>
`;
