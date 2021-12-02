const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const input = loadInput({ test });

// START CODE FOR DAY'S PUZZLES HERE
const isActive = cube => (cube === '#' ? 1 : 0);

const initPlane = input.map(str => str.split(''));

const STEPS = 6;
const S = STEPS * 2 + initPlane.length;
const Z = STEPS * 2 + 1;

const initPlaneExpanded = new Array(S).fill().map((_, x) => {
    if (x < STEPS || x >= (S - STEPS)) return new Array(S).fill(null);
    const arrayPadding = new Array(STEPS).fill(null);
    return [...arrayPadding, ...initPlane[x - STEPS], ...arrayPadding];
});

const emptyPlane = new Array(S).fill().map(() => new Array(S).fill(null));

const initCubes = new Array(Z).fill().map((_, z) => (z === Math.floor(Z/2)) ? initPlaneExpanded : [...emptyPlane]);

const directions = [-1, 0, 1];
const countActiveNeighbors = (x, y, z, cubes) => {
    return directions.reduce(
    (sum3D, dirZ) => sum3D + ((z + dirZ < 0 || z + dirZ >= Z) ? 0 : directions.reduce(
        (sum2D, dirY) => sum2D + ((y + dirY < 0 || y + dirY >= S) ? 0 : directions.reduce(
            (sum1D, dirX) => sum1D + (isActive(cubes[z + dirZ][y + dirY][x + dirX]) ? 1 : 0), 0
        )), 0
    )), 0
) - isActive(cubes[z][y][x])};

const countActiveTotal = (cubes) => cubes.reduce(
    (cubesSum, plane) => cubesSum + plane.reduce(
        (planeSum, row) => planeSum + row.reduce(
            (rowSum, cube) => rowSum + isActive(cube),
        0),
    0),
0);

const calcNextStep = (cubes) => cubes.map((plane, z) => plane.map((row, y) => row.map((cube, x) => {
    const count = countActiveNeighbors(x, y, z, cubes);
    return ((isActive(cube) && (count === 2 || count === 3)) || (!isActive(cube) && (count === 3))) ? '#' : '.';
})));

let cubes = initCubes;
for (let step = 0; step < STEPS; step++) {
    cubes = calcNextStep(cubes);
}

console.log(countActiveTotal(cubes));
