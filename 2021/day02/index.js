const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

// PART 1
let depth = 0;
let horz = 0;

input.forEach(step => {
    const [direction, xStr] = step.split(' ');
    const x = parseInt(xStr);
    switch (direction) {
        case 'forward':
            horz += x;
            break;
        case 'down':
            depth += x;
            break;
        case 'up':
            depth -= x;
            break;
    }
});

console.dir({ depth, horz, res: depth * horz });

// PART 2
// down X increases your aim by X units.
// up X decreases your aim by X units.
// forward X does two things:
// It increases your horizontal position by X units.
// It increases your depth by your aim multiplied by X.

depth = 0;
horz = 0;
let aim = 0;

input.forEach(step => {
    const [direction, xStr] = step.split(' ');
    const x = parseInt(xStr);
    switch (direction) {
        case 'forward':
            horz += x;
            depth += aim * x;
            break;
        case 'down':
            aim += x;
            break;
        case 'up':
            aim -= x;
            break;
    }
});

console.dir({ depth, horz, res: depth * horz })
