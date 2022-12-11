const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

// PARTS 1 & 2
let cycle = 1;
let X = 1;

const addIfIsInteresting = (cycle, X) => (
    (cycle === 20 || (cycle > 20 && ((cycle - 20) % 40 ) === 0))
        ? cycle * X
        : 0
);

const makeCRT = (cycle, X, arr) => {
    arr.push((Math.abs(((cycle - 1) % 40) - X) <= 1) ? '#' : '.');
    if (arr.length === 40) {
        console.log(arr.join(''));
        return [];
    }
    return arr;
}

let signalSum = 0;
let imageArray = [];
input.forEach((row) => {
    signalSum += addIfIsInteresting(cycle, X);
    imageArray = makeCRT(cycle, X, imageArray);

    if (row === 'noop') {
        cycle += 1;
    } else {
        const [_, num] = row.split(' ');
        signalSum += addIfIsInteresting(cycle + 1, X);
        imageArray = makeCRT(cycle + 1, X, imageArray);
        X += +num;
        cycle += 2;    
    }
}, 0);
console.log(signalSum);
