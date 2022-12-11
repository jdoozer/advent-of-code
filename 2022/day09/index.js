const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

// helpers
const posToStr = ({ x, y }) => `${x},${y}`;

const getNextTailPos = (H, T) => {
    const xDiff = Math.abs(H.x - T.x);
    const xDiffSign = Math.sign(H.x - T.x);
    const yDiff = Math.abs(H.y - T.y);
    const yDiffSign = Math.sign(H.y - T.y);

    if (xDiff > 1) {
        T.x += 1 * xDiffSign;
        if (yDiff === 1) {
            T.y = H.y;
        }
    }

    if (yDiff > 1) {
        T.y += 1 * yDiffSign;
        if (xDiff === 1) {
            T.x = H.x;
        }
    }

    return T;
}

// PART 1
let H = { x: 0, y: 0};
let T = { x: 0, y: 0};

let tailPositions = [posToStr(T)];

for (const row of input) {
    const [direction, numSteps] = row.split(' ');
    for (let i = 0; i < +numSteps; i++) {
        // first move H
        switch (direction) {
            case 'R':
                H.x += 1;
                break;
            case 'L':
                H.x -= 1;
                break;
            case 'U':
                H.y += 1;
                break;
            case 'D':
                H.y -= 1;
                break;
        }
        // then move T
        T = getNextTailPos(H, T);
        tailPositions.push(posToStr(T));
    }
}

console.dir({ H, T });

const uniqueTailPositions = new Set(tailPositions);
console.log(uniqueTailPositions.size)

// PART 2
const NUM_KNOTS = 10;

const knotPositions = new Array(NUM_KNOTS).fill().map(_ => ({ x: 0, y: 0}));

tailPositions = [posToStr(knotPositions[NUM_KNOTS - 1])];

for (const row of input) {
    const [direction, numSteps] = row.split(' ');

    // console.log(row);
    for (let i = 0; i < +numSteps; i++) {

        // first move head
        switch (direction) {
            case 'R':
                knotPositions[0].x += 1;
                break;
            case 'L':
                knotPositions[0].x -= 1;
                break;
            case 'U':
                knotPositions[0].y += 1;
                break;
            case 'D':
                knotPositions[0].y -= 1;
                break;
        }

        // then move each subsequent knot
        for (let k = 1; k < NUM_KNOTS; k++) {
            knotPositions[k] = getNextTailPos(knotPositions[k-1], knotPositions[k]);
        }
        tailPositions.push(posToStr(knotPositions[NUM_KNOTS - 1]));
    }
}

const uniqueTailPositions2 = new Set(tailPositions);
console.log(uniqueTailPositions2.size)
