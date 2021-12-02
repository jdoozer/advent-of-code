const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test, number: true });

// PART 1
const numberIncreases = input.reduce((count, num, ind) => count + ((num > input[ind-1]) ? 1 : 0), 0);
console.log(numberIncreases);

// PART 2
const windowIncreases = input.reduce((count, num, ind) => count + ((num > input[ind-3]) ? 1 : 0), 0);
console.log(windowIncreases);
