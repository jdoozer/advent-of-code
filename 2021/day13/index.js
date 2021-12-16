const loadInput = require('../../lib/loadInput');
const printMatrix = require('../../lib/printMatrix');

const test = (process.argv[2] === 'test');
const input = loadInput({ test, delimiter: '\n\n' });

// helpers for both parts
const mapDotToString = (dot) => `${dot.x},${dot.y}`;
const mapStringToDot = (dotStr) => {
    const [x, y] = dotStr.split(',').map(num => +num);
    return { x, y };
};

const dots = input[0].split('\n').map(mapStringToDot);
const folds = input[1].split('\n').map(foldStr => {
    const match = foldStr.match(/([xy])=([0-9]+)/);
    return { direction: match[1], line: +match[2] };
});


function makeFold(dots, { direction, line }, removeDupes=false) {
    const dotsAfterFold = [];
    for (const dot of dots) {
        if (dot[direction] < line) {
            dotsAfterFold.push(dot);
        } else {
            dotsAfterFold.push({ ...dot, [direction]: 2 * line - dot[direction] });
        }
    }
    // remove any duplicates
    return removeDupes
        ? [...new Set(dotsAfterFold.map(mapDotToString))].map(mapStringToDot)
        : dotsAfterFold;
}

// console.log(dots)
// console.log(folds)

// PART 1
console.log(makeFold(dots, folds[0], true).length)

// PART 2
function plotDots(dots) {
    const xMax = Math.max(...dots.map(dot => dot.x));
    const yMax = Math.max(...dots.map(dot => dot.y));
    const paper = Array(yMax + 1).fill(null).map(_ => [...Array(xMax + 1).fill('.')]);
    for (const { x, y } of dots) {
        paper[y][x] = '#';
    }
    return paper;
}

let newDots = [...dots];
for (const fold of folds) {
    newDots = makeFold(newDots, fold);
}
printMatrix(plotDots(newDots));
