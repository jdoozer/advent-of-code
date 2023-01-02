const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

const cubes = input.map(row => {
  const rowArr = row.split(',');
  return { x: +rowArr[0], y: +rowArr[1], z: +rowArr[2] };
});

const { xMin, xMax, yMin, yMax, zMin, zMax } = cubes.reduce((vals, { x, y, z }) => {
  if (x < vals.xMin) vals.xMin = x;
  if (x > vals.xMax) vals.xMax = x;
  if (y < vals.yMin) vals.yMin = y;
  if (y > vals.yMax) vals.yMax = y;
  if (z < vals.zMin) vals.zMin = z;
  if (z > vals.zMax) vals.zMax = z;
  return vals;
}, { xMin: Infinity, xMax: 0, yMin: Infinity, yMax: 0, zMin: Infinity, zMax: 0 });

// PART 1
const cubeExposedSides = cubes.map(({ x, y, z }) => {
  const xSide1 = x === xMin || !cubes.find(cube => cube.x === x-1 && cube.y === y && cube.z === z);
  const xSide2 = x === xMax || !cubes.find(cube => cube.x === x+1 && cube.y === y && cube.z === z);
  const ySide1 = y === yMin || !cubes.find(cube => cube.x === x && cube.y === y-1 && cube.z === z);
  const ySide2 = y === yMax || !cubes.find(cube => cube.x === x && cube.y === y+1 && cube.z === z);
  const zSide1 = z === zMin || !cubes.find(cube => cube.x === x && cube.y === y && cube.z === z-1);
  const zSide2 = z === zMax || !cubes.find(cube => cube.x === x && cube.y === y && cube.z === z+1);
  return +xSide1 + +xSide2 + +ySide1 + +ySide2 + +zSide1 + +zSide2;
});

console.log(cubeExposedSides.reduce((total, num) => total + num, 0));

// PART 2
cubes.sort(({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }) => (x1 - x2) || (y1 - y2) || (z1 - z2));

console.log(cubes)
