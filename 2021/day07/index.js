const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test, delimiter: ',', number: true });

// PART 1
const fuelCost1 = (positions, target) => positions.reduce((sum, p) => sum + Math.abs(p - target), 0);

const findMinFuel1 = arr => {
    const sorted = [...arr].sort((a, b) => a - b);
    const medianInd = Math.floor((sorted.length - 1) / 2);

    if (sorted.length % 2 === 1) {
        return fuelCost1(sorted, sorted[medianInd]);
    } else {
        const median = Math.floor((sorted[medianInd] + sorted[medianInd + 1]) / 2);
        return fuelCost1(sorted, median);
    }
}

console.log(findMinFuel1(input));

// PART 2
const crabFuelCost = (position, target) => {
    if (position === target) {
        return 0;
    }
    if (position > target) {
        return (position - target) + crabFuelCost(position-1, target);
    }
    return (target - position) + crabFuelCost(position+1, target);
}

const fuelCost2 = (positions, target) => positions.reduce((sum, p) => sum + crabFuelCost(p, target), 0);

const getAvg = arr => arr.reduce((sum, p) => sum + p, 0) / arr.length;

const avg = getAvg(input);

// then we check the numbers on either side of the average
const target1 = Math.floor(avg);
const target2 = target1 + 1;
const fuel1 = fuelCost2(input, target1);
const fuel2 = fuelCost2(input, target2);

console.dir({ fuel1, fuel2, min: Math.min(fuel1, fuel2) });
