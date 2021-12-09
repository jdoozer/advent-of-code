const loadInput = require('../../lib/loadInput');
const printMatrix = require('../../lib/printMatrix');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });
// const input = loadInput({ test, filename: 'input_andy.txt' });

const numsort = (a, b) => a - b;

// PART 1
// first let's iterate through our input to find all the horizontal and vertical vents
const vents = [];
let xMax = 0;
let yMax = 0;

for (const inputVent of input) {
    const [pt1, pt2] = inputVent.split(' -> ')
                                .map(pt => pt.split(',')
                                             .map(val => parseInt(val)))
                                .map(([x, y]) => ({ x, y }));

    let newVent;
    if (pt1.x === pt2.x) {
        newVent = { x: pt1.x, y: [pt1.y, pt2.y].sort(numsort), direction: 'vertical' };
        xMax = Math.max(xMax, pt1.x);
        yMax = Math.max(yMax, pt1.y, pt2.y);
    } else if (pt1.y === pt2.y) {
        newVent = { x: [pt1.x, pt2.x].sort(numsort), y: pt1.y, direction: 'horizontal' };
        xMax = Math.max(xMax, pt1.x, pt2.x);
        yMax = Math.max(yMax, pt1.y);
    } else {
        // diagonal (part 2)
        const direction = ((pt2.x > pt1.x) === (pt2.y > pt1.y)) ? 'diag_inc' : 'diag_dec';
        newVent = { x: [pt1.x, pt2.x].sort(numsort), y: [pt1.y, pt2.y].sort(numsort), direction };
        xMax = Math.max(xMax, pt1.x, pt2.x);
        yMax = Math.max(yMax, pt1.y, pt2.y);
    }
    vents.push(newVent);
}

// intialize floor
let floor = Array(yMax + 1).fill(null).map(_ => [...Array(xMax + 1).fill(0)]);

for (const { x, y, direction } of vents) {
    switch (direction) {
        case 'horizontal':
            for (let xCurr = x[0]; xCurr <= x[1]; xCurr++) {
                floor[y][xCurr] += 1;
            }
            break;
        case 'vertical':
            for (let yCurr = y[0]; yCurr <= y[1]; yCurr++) {
                floor[yCurr][x] += 1;
            }
            break;
        case 'diag_inc':
            for (let xCurr = x[0]; xCurr <= x[1]; xCurr++) {
                floor[y[0] + xCurr - x[0]][xCurr] += 1;
            }
            break;
        case 'diag_dec':
            for (let xCurr = x[0]; xCurr <= x[1]; xCurr++) {
                // need to go in the opposite direction through Y values for the decreasing lines
                floor[y[1] - xCurr + x[0]][xCurr] += 1;
            }
            break;
    }
}

if (test) {
    printMatrix(floor);
}

const overlapPts = floor.reduce((overlaps, row) => overlaps + row.filter(count => count >= 2).length, 0);

console.log(overlapPts);
