const loadInput = require('../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const input = loadInput({ test });

// START CODE FOR DAY'S PUZZLES HERE

// Part 1
const startCoords = { x: 0, y: 0 };
const tree = '#';

const slope = { x: 3, y: 1 };

const xBase = input[0].length;

let { x, y } = startCoords;
let treeCount = 0;

while (y < input.length) {
    if (input[y].charAt(x % xBase) === tree) {
        treeCount++;
    }
    x = x + slope.x;
    y = y + slope.y;
}

console.log(treeCount);


// Part 2
const slopes = [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 5, y: 1 },
    { x: 7, y: 1 },
    { x: 1, y: 2 },
];

let treeCountProduct = 1;

slopes.forEach(slope => {
    x = startCoords.x;
    y = startCoords.y;
    treeCount = 0;

    while (y < input.length) {
        if (input[y].charAt(x % xBase) === tree) {
            treeCount++;
        }
        x = x + slope.x;
        y = y + slope.y;
    }
    treeCountProduct = treeCountProduct * treeCount;
});ß

console.log(treeCountProduct);
