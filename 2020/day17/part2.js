const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const input = loadInput({ test });

// START CODE FOR DAY'S PUZZLES HERE
const isActive = cube => (cube === '#' ? 1 : 0);

const initPlane = input.map(str => str.split(''));

const STEPS = 6;
const X = STEPS * 2 + initPlane[0].length;
const Y = STEPS * 2 + initPlane.length;
const Z = STEPS * 2 + 1;
const W = Z;

const initPlaneExpanded = new Array(Y).fill().map((_, y) => {
    if (y < STEPS || y >= (Y - STEPS)) return new Array(X).fill(null);
    const arrayPadding = new Array(STEPS).fill(null);
    return [...arrayPadding, ...initPlane[y - STEPS], ...arrayPadding];
});

const emptyPlane = new Array(Y).fill().map(() => new Array(X).fill(null));

const initHyperCube = new Array(W).fill().map((_, w) => (
    new Array(Z).fill().map((_, z) => (
        (z === Math.floor(Z/2) && w === Math.floor(W/2)) ? initPlaneExpanded : [...emptyPlane]
    ))
));

const directions = [-1, 0, 1];
const countActiveNeighbors = (x, y, z, w, hyperCube) => {
    return directions.reduce(
        (sum4D, dirW) => sum4D + ((w + dirW < 0 || w + dirW >= W) ? 0 : directions.reduce(
            (sum3D, dirZ) => sum3D + ((z + dirZ < 0 || z + dirZ >= Z) ? 0 : directions.reduce(
                (sum2D, dirY) => sum2D + ((y + dirY < 0 || y + dirY >= Y) ? 0 : directions.reduce(
                    (sum1D, dirX) => sum1D + (isActive(hyperCube[w + dirW][z + dirZ][y + dirY][x + dirX]) ? 1 : 0), 0
                )), 0
            )), 0
        )), 0
) - isActive(hyperCube[w][z][y][x])};

const countActiveTotal = (hyperCube) => hyperCube.reduce(
    (hyperCubeSum, cube) => hyperCubeSum + cube.reduce(
        (cubeSum, plane) => cubeSum + plane.reduce(
            (planeSum, row) => planeSum + row.reduce(
                (rowSum, elem) => rowSum + isActive(elem),
            0),
        0),
    0),
0);

const calcNextStep = (hyperCube) => hyperCube.map((cube, w) => cube.map((plane, z) => plane.map((row, y) => row.map((elem, x) => {
    const count = countActiveNeighbors(x, y, z, w, hyperCube);
    return ((isActive(elem) && (count === 2 || count === 3)) || (!isActive(elem) && (count === 3))) ? '#' : '.';
}))));

let hyperCube = initHyperCube;
for (let step = 0; step < STEPS; step++) {
    hyperCube = calcNextStep(hyperCube);
}

console.log(countActiveTotal(hyperCube));
