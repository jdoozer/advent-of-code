const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

// helpers for both parts
const [, ...matches] = input[0].match(/target area: x=([-\d]*)..([-\d]*), y=([-\d]*)..([-\d]*)/);
const [x0, x1, y0, y1]= matches.map(str => parseInt(str));

// PART 1
const velocityForMaxHeight = -(y0 + 1);
const maxHeight = v => v * (v + 1) / 2;
console.log(maxHeight(velocityForMaxHeight));

// PART 2
const vxMin = Math.ceil(1/2 * (Math.sqrt(1 + 8 * x0) - 1));
const vxMax = x1;
const vyMin = y0;
const vyMax = velocityForMaxHeight;

const step = ({ x, y, vx, vy }) => ({
  x: x + vx,
  y: y + vy,
  vx: vx ? vx - 1 : 0,
  vy: vy - 1,
});

const initialVelocities = [];
for (let vx0 = vxMin; vx0 <= vxMax; vx0++) {
  for (let vy0 = vyMin; vy0 <= vyMax; vy0++) {
    let curr = { x: 0, y: 0, vx: vx0, vy: vy0 };
    while (true) {
      const { x, y } = curr;
      if (x >= x0 && x <= x1 && y >= y0 && y <= y1) {
        initialVelocities.push([vx0, vy0]);
        break;
      }
      if ((x < x0 && y >= y0) || (y > y1 && x <= x1)) {
        curr = step(curr);
      } else {
        break;
      }
    }
  }
}

// console.log(initialVelocities);
console.log(initialVelocities.length);
