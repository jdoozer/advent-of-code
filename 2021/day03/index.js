const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

// PART 1
const numDigits = input[0].length;
const gammaCutoff = input.length / 2;
const mask = parseInt('1'.repeat(numDigits), 2);

const inputSumsByDigit = input.reduce((sums, row) => {
    const rowDigits = row.split('');
    return sums.map((sum, i) => sum + parseInt(rowDigits[i]));
}, Array(numDigits).fill(0));

const gammaStr = inputSumsByDigit.map(sum => (sum > gammaCutoff) ? 1 : 0).join('');
const gamma = parseInt(gammaStr, 2);
const epsilon = gamma ^ mask;

console.dir({ gamma, epsilon, ans: gamma * epsilon})

// PART 2
const findRating = (criteria, diagnostics) => {
    let filteredDiagnostics = [...diagnostics];
    let index = 0;

    while (filteredDiagnostics.length > 1) {
        const bitToLookFor = criteria(filteredDiagnostics, index).toString();
        filteredDiagnostics = filteredDiagnostics.filter(diagnostic => diagnostic[index] === bitToLookFor);
        index++;
    }
    return parseInt(filteredDiagnostics[0], 2);
}

const mostCommonBit = (binaryStrs, index) => {
    const sumAtIndex = binaryStrs.reduce((sum, row) => sum + parseInt(row[index]), 0);
    return (sumAtIndex >= binaryStrs.length / 2) ? '1' : '0';
};
const leastCommonBit = (binaryStrs, index) => mostCommonBit(binaryStrs, index) ^ 1;

const oxygenRating = findRating(mostCommonBit, input);
const scrubberRating = findRating(leastCommonBit, input);

console.dir({ oxygenRating, scrubberRating, ans: oxygenRating * scrubberRating });
