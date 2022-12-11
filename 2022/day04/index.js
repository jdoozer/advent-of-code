const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

// helpers
const regex = /(\d+)-(\d+),(\d+)-(\d+)/;

// PART 1 AND 2
let containedPairsCount = 0;
let overlappingPairsCount = 0;

input.forEach((row) => {
    const [_, min1Str, max1Str, min2Str, max2Str] = row.match(regex);
    const min1 = parseInt(min1Str, 10);
    const max1 = parseInt(max1Str, 10);
    const min2 = parseInt(min2Str, 10);
    const max2 = parseInt(max2Str, 10);

    if ((min1 <= min2 && max1 >= max2) || (min2 <= min1 && max2 >= max1)) {
        containedPairsCount++;
        overlappingPairsCount++;
    } else if ((min1 <= min2 && max1 >= min2) || (min1 <= max2 && max1 >= max2)) {
        overlappingPairsCount++
    };
});

console.log(containedPairsCount);
console.log(overlappingPairsCount);
