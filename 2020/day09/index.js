const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const input = loadInput({ test, number: true });

// START CODE FOR DAY'S PUZZLES HERE
const preamble = test ? 5 : 25;

// part 1
const isSumOfTwo = (target, arr) => {
    arr.sort((a, b) => a - b);
    let lowInd = 0;
    let highInd = arr.length - 1;
    while (lowInd < highInd) {
        currSum = arr[lowInd] + arr[highInd];
        if (currSum === target) {
            return true;
        } else if (currSum < target) {
            lowInd++;
        } else {
            highInd--;
        }
    }
    return false;
}

const invalidNumber = input.find((num, ind) => ind >= preamble && !isSumOfTwo(num, input.slice(ind - preamble, ind)));

console.log(invalidNumber);


// part 2
const findContiguousAddends = (target, arr) => {
    let lowInd = arr.findIndex(elem => elem < target);
    let highInd = lowInd + 1;
    let runningSum = arr[lowInd] + arr[highInd];

    while (highInd < arr.length) {
        if (runningSum === target) {
            return arr.slice(lowInd, highInd+1);
        }
        if (runningSum > target) {
            if (highInd - lowInd === 1) {
                lowInd++;
                highInd++;
                runningSum = arr[lowInd] + arr[highInd];
                continue;
            }
            runningSum -= arr[lowInd];
            lowInd++;
            continue;
        }
        highInd++;
        runningSum += arr[highInd];
    }
    return [];
}

const contigArray = findContiguousAddends(invalidNumber, input);

console.log(Math.min(...contigArray) + Math.max(...contigArray));
