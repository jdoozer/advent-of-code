const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const instructions = loadInput({ test });

// START CODE FOR DAY'S PUZZLES HERE
const instructionRegEx = /(acc|nop|jmp) ([+-][0-9]+)/;

// part 1
let instructionsUsed = new Set();
let currInd = 0;
let accumulator = 0;

while (!instructionsUsed.has(currInd)) {
    const [_, action, value] = instructionRegEx.exec(instructions[currInd]);
    instructionsUsed.add(currInd);

    // console.dir({ currInd,action, value, accumulator })

    switch (action) {
        case 'jmp':
            currInd += parseInt(value, 10);
            break;
        case 'acc':
            accumulator += parseInt(value, 10);
        case 'nop':
            currInd += 1;
    }
}

console.log(accumulator);


// part 2
const instr = instructions.map(instruction => {
    const [_, action, value] = instructionRegEx.exec(instruction);
    return { action, value };
});

currInd = 0;
let attemptedSwaps = new Set();
let madeASwap;

while (currInd < instr.length) {
    instructionsUsed = new Set();
    currInd = 0;
    accumulator = 0;
    madeASwap = false;

    while (!instructionsUsed.has(currInd) && currInd < instr.length) {
        instructionsUsed.add(currInd);
        const { action, value } = instr[currInd];

        switch (action) {
            case 'jmp':
                if (madeASwap || attemptedSwaps.has(currInd)) {
                    currInd += parseInt(value, 10);
                } else {
                    attemptedSwaps.add(currInd);
                    madeASwap = true; 
                    currInd += 1;
                }
                break;
            case 'acc':
                accumulator += parseInt(value, 10);
                currInd += 1;
                break;
            case 'nop':
                if (madeASwap || attemptedSwaps.has(currInd)) {
                    currInd += 1;
                } else {
                    attemptedSwaps.add(currInd);
                    madeASwap = true; 
                    currInd += parseInt(value, 10);
                }
                break;
        }
    }
}

console.log(accumulator);
