const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const input = loadInput({ test });

// START CODE FOR DAY'S PUZZLES HERE

const getTreeCount = (inputData, slope, width, tree) => {
    let { x, y } = { x: 0, y: 0 };
    let treeCount = 0;

    while (y < inputData.length) {
        if (inputData[y].charAt(x % width) === tree) {
            treeCount++;
        }
        x = x + slope.x;
        y = y + slope.y;
    }
    return treeCount;
};

const tree = '#';
const width = input[0].length;
const slope = { x: 3, y: 1 };

console.log('Part 1:')
console.log(getTreeCount(input, slope, width, tree));

const slopes = [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 5, y: 1 },
    { x: 7, y: 1 },
    { x: 1, y: 2 },
];

const treeCountProduct = slopes.reduce((product, slope) => product * getTreeCount(input, slope, width, tree), 1);

console.log('Part 2:')
console.log(treeCountProduct);
