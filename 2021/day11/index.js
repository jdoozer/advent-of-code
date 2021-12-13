const loadInput = require('../../lib/loadInput');
const printMatrix = require('../../lib/printMatrix');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

// helpers for both parts
const size = 10;

// PART 1
function step(grid) {
    const flash = [];
    let flashCount = 0;

    // First, the energy level of each octopus increases by 1.
    let nextGrid = grid.map((row, y) => row.map((val, x) => {
        if (val === 9) flash.push([x, y])
        return val + 1;
    }));

    // Helper for next step
    function incrementFromFlash(x, y) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
            const val = nextGrid[y][x];
            if (val >= 9) {
                flash.push([x,y]);
            }
            if (val > 0) {
                nextGrid[y][x] = val + 1;
            };
        }
    }

    // Next is the flashing for energy levels > 9 (after increments)
    // Let's set energy to 0 as it flashes; then as we increment adjacent octopi, only do so if their value is > 0
    while (flash.length) {
        const [x, y] = flash.pop();
        if (nextGrid[y][x] === 0) {
            continue; // means we already flashed this one
        }
        incrementFromFlash(x - 1, y - 1);
        incrementFromFlash(x - 1, y);
        incrementFromFlash(x - 1, y + 1);
        incrementFromFlash(x, y - 1);
        incrementFromFlash(x, y + 1);
        incrementFromFlash(x + 1, y - 1);
        incrementFromFlash(x + 1, y);
        incrementFromFlash(x + 1, y + 1);
        nextGrid[y][x] = 0;
        flashCount++;
    }

    return { nextGrid, flashCount };
}

const numSteps = 100;
let octopusGrid = input.map(row => row.split('').map(str => +str));
let totalFlashes = 0;

for (let s = 0; s < numSteps; s++) {
    const { nextGrid, flashCount } = step(octopusGrid);
    octopusGrid = nextGrid;
    totalFlashes += flashCount;
}

console.log(totalFlashes)

// PART 2
octopusGrid = input.map(row => row.split('').map(str => +str));
let flashCount = 0;
let stepCount = 0;
while (flashCount < size * size) {
    next = step(octopusGrid);
    octopusGrid = next.nextGrid;
    flashCount = next.flashCount;
    stepCount++;
}

console.log(stepCount)
