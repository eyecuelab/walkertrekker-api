function random_bm() {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function run1000times() {
  let results = []
  for (let i = 1; i <= 1000; i++) {
    results.push(random_bm())
  }
  return results
}

const test = run1000times()
const sum = test.reduce(function(a, b) { return a + b; });
const avg = sum / test.length;

console.log(`max: ${Math.max( ...test )}`)
console.log(`average: ${avg}`)
console.log(`min: ${Math.min( ...test )}`)
process.exit(0)
