const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test, delimiter: '\n\n' });

// PART 1
const caloriesByElf = input.map(elfAmts => 
    elfAmts.split('\n').reduce((sum, amt) => sum + parseInt(amt, 10), 0));
// console.log(caloriesByElf)
console.log(Math.max(...caloriesByElf));

// PART 2
const topThreeCalories = caloriesByElf.sort((a, b) => b - a).slice(0,3).reduce((sum, amt) => sum + amt, 0);
console.log(topThreeCalories)
