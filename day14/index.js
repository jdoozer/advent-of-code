const loadInput = require('../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
let input = loadInput({ test });

// START CODE FOR DAY'S PUZZLES HERE
const maskRegEx = /mask = ([01X]+)/;
const memoryRegEx = /mem\[(\d+)\] = (\d+)/;

// part 1
const applyMask = (valueStr, mask) => {
    let value = parseInt(valueStr, 10);
    if (mask) {
        let maskChar;
        for (let i = 0; i < mask.length; i++) {
            maskChar = mask.charAt(i);
            if (maskChar !== 'X') {
                maskChar = parseInt(maskChar, 2);
                const bitMask = 2 ** (mask.length - i - 1);

                if (maskChar && !(value & bitMask)) {
                    value += bitMask;
                }
                if (!maskChar && (value & bitMask)) {
                    value -= bitMask;
                }
                // console.dir({ i, beg: value.toString(2), msk: bitMask.toString(2), maskChar, end: value.toString(2) })
            }
        }
    }
    return value;
}

let mask;
let memory = {};
input.forEach(line => {
    if (maskRegEx.test(line)) {
        [, mask] = maskRegEx.exec(line);
        return;
    }
    const [_, memLoc, value] = memoryRegEx.exec(line);
    const maskedValue = applyMask(value, mask);
    memory[memLoc] = maskedValue;
});

const sumOfMemory = memoryObj => Array.from(Object.values(memoryObj)).reduce((sum, val) => sum + val, 0);

console.log(sumOfMemory(memory));

// part 2
input = test ? [
    'mask = 000000000000000000000000000000X1001X',
    'mem[42] = 100',
    'mask = 00000000000000000000000000000000X0XX',
    'mem[26] = 1',
] : input;

const applyFloatingMask = (valueStr, floatingMask) => {
    let value = parseInt(valueStr, 10);
    if (!floatingMask) return [value];

    for (let i = 0; i < mask.length; i++) {
        if (mask.charAt(i) === '1') {
            const currBitMask = 2 ** (mask.length - i - 1);
            if (!(value & currBitMask)) {
                value += currBitMask;
            }
        }
    }

    let values = [value];

    for (let i = 0; i < mask.length; i++) {
        if (mask.charAt(i) === 'X') {
            const currBitMask = 2 ** (mask.length - i - 1);
            values.forEach(value => values.push(value + currBitMask * ((value & currBitMask) ? -1 : 1)));
        }
    }
    return values;
}

mask = '';
memory = {};

input.forEach(line => {
    if (maskRegEx.test(line)) {
        [, mask] = maskRegEx.exec(line);
        return;
    }
    const [, memLoc, value] = memoryRegEx.exec(line);
    const addresses = applyFloatingMask(memLoc, mask);
    addresses.forEach(address => memory[address] = parseInt(value, 10));
});

console.log(sumOfMemory(memory));