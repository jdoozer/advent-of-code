const loadInput = require('../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test, number: true });

const target = 2020;

input.sort((a, b) => a - b);

// PART 1
let lowInd = 0;
let highInd = input.length - 1;

while (lowInd < highInd) {
    currSum = input[lowInd] + input[highInd];
    if (currSum === target) {
        console.log(input[lowInd] * input[highInd]);
        break;
    } else if (currSum < target) {
        lowInd++;
    } else {
        highInd--;
    }
}

// PART 2
lowInd = 0;
midInd = 1;
highInd = 2;

while (lowInd < midInd) {
    currSum = input[lowInd] + input[midInd] + input[highInd];
    if (currSum === target) {
        console.log(input[lowInd] * input[midInd] * input[highInd]);
        break;
    } else if (currSum > target || highInd === input.length - 1) {
        if (midInd === input.length - 2) {
            lowInd++;
            midInd = lowInd + 1;
            highInd = midInd + 1;
        } else {
            midInd++;
            highInd = midInd + 1;
        }
    } else {
        highInd++;
    }
}
