const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test, delimiter: ',', number: true });

// fish at 0 => 6 + 8
// fish at 1 => 0
// fish at 2 => 1
// fish at 3 => 2
// fish at 4 => 3
// fish at 5 => 4
// fish at 6 => 5
// fish at 7 => 6


// PART 1
// let's sort the fish by how many we have with each timer value (can use value as array key)
const MAX_TIMER = 8;
const RESET_VAL = 6;
const fishCounts = Array(MAX_TIMER+1).fill(0);
input.forEach(fishTimer => fishCounts[fishTimer] += 1);

// helper to increment timers on a day
const updateCounts = (startingCounts) => startingCounts.map((_, index) => {
    if (index === MAX_TIMER) {
        return startingCounts[0];
    }
    return startingCounts[index + 1] + (index === RESET_VAL) ? startingCounts[0] : 0;
});

// update for some stretch of days
const simulate = (initialCounts, days) => {
    let counts = initialCounts;
    for (let day = 1; day <= days; day++) {
        // console.log(`DAY ${day}: ${counts.join(', ')}`);
        counts = updateCounts(counts);
    }
    return counts;
}

const finalCounts = simulate(fishCounts, 256);

console.log(finalCounts.reduce((sum, count) => sum + count, 0))
