const testInd = process.argv[2];

const testInputs = [
    [0,3,6], // input 0 -> 436
    [1,3,2], // input 1 -> 1
    [2,1,3], // input 2 -> 10
    [1,2,3], // input 3 -> 27
    [2,3,1], // input 4 -> 78
    [3,2,1], // input 5 -> 438
    [3,1,2], // input 6 -> 1836
];

const puzzleInput = [8,0,17,4,1,12];

const input = (testInd === undefined) ? puzzleInput : testInputs[testInd];

const numTurns = 2020;
// const numTurns = 30000000;
// const numTurns = 10;

let turnValues = {};
let value;
for (let i = 0; i < numTurns; i++) {
    if (i < input.length) {
        value = input[i];
        turnValues[value] = { last: i };
        continue;
    }

    const previousTurnValue = turnValues[value];
    value = (previousTurnValue.prev !== undefined) ? (i - 1 - previousTurnValue.prev) : 0;
    console.dir({i, value})

    turnValues[value] = turnValues[value] ? { last: i, prev: turnValues[value].last } : { last: i };
}

// console.dir({ value, turnValues })

console.log(value)