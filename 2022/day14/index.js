const loadInput = require('../../lib/loadInput');
const printMatrix = require('../../lib/printMatrix');

const test = (process.argv[2] === 'test');
const input = loadInput({ test, delimiter: '\n' });

const makeSegmentStr = (dim, range, direction) => `${dim}-${direction}-${range.sort((a, b) => a-b).toString()}`;
const decodeSegmentStr = (str) => {
    const [dim, direction, range] = str.split('-');
    const rangeArr = range.split(',').map(rangeStr => +rangeStr);
    if (direction === 'H') {
        return { x: rangeArr, y: +dim };
    } else if (direction === 'V') {
        return { x: +dim, y: rangeArr };
    } else {
        throw new Error('invalid direction in segment string');
    }
};
const makeArray = (size, fill='.') => new Array(size).fill(fill);

const segments = new Set();
let xMin = Infinity;
let yMin = Infinity;
let xMax = 0;
let yMax = 0;

const uniqueRockPaths = [...new Set(input)];
uniqueRockPaths.forEach((path) => {
    const points = path.split(' -> ').map((point) => point.split(',').map((str) => +str));
    points.forEach(([x, y], i) => {
        xMin = Math.min(xMin, x);
        xMax = Math.max(xMax, x);
        yMin = Math.min(yMin, y);
        yMax = Math.max(yMax, y);
        if (i > 0) {
            const [x0, y0] = points[i-1];
            if (x0 === x) {
                segments.add(makeSegmentStr(x, [y0, y], 'V'));
            } else if (y0 === y) {
                segments.add(makeSegmentStr(y, [x0, x], 'H'));
            } else {
                throw new Error('segments must be horizontal or vertical')
            }
        }
    });
});

const scan = new Array(yMax+1).fill().map(_ => makeArray(xMax-xMin+1));
[...segments].forEach((segmentStr) => {
    const { x, y } = decodeSegmentStr(segmentStr);
    if (Array.isArray(x)) {
        for (let xCurr = x[0]; xCurr <= x[1]; xCurr++) {
            scan[y][xCurr - xMin] = '#';
        }
    } else if (Array.isArray(y)) {
        for (let yCurr = y[0]; yCurr <= y[1]; yCurr++) {
            scan[yCurr][x - xMin] = '#';
        }
    }
});

const dropSand1 = (state) => {
    let xSand = 500 - xMin;
    let ySand = 0;

    while (true) {
        if (ySand >= yMax) {
            return false;
        }
        if (state[ySand+1][xSand] === '.') {
            ySand = ySand + 1;
            continue;
        }
        if (state[ySand+1][xSand-1] === '.') {
            ySand = ySand + 1;
            xSand = xSand - 1;
            continue;
        }
        if (state[ySand+1][xSand+1] === '.') {
            ySand = ySand + 1;
            xSand = xSand + 1;
            continue;
        }
        break;
    }

    if (xSand <= 0 || xSand > (xMax - xMin)) {
        return false;
    }

    state[ySand][xSand] = 'o';
    return true;
};

const state1 = scan.map((row) => [...row]);

let grains = 0;
while (true) {
    const res = dropSand1(state1);
    if (res) {
        grains++;
    } else {
        break;
    }
}

// printMatrix(state, { delimiter: ''})
console.log(grains);


// PART 2
const dropSand2 = (state) => {
    let xSand = 500 - xMin + yMax;
    let ySand = 0;

    if (state[ySand][xSand] === 'o') {
        return false;
    }

    while (true) {
        if (state[ySand+1][xSand] === '.') {
            ySand = ySand + 1;
            continue;
        }
        if (state[ySand+1][xSand-1] === '.') {
            ySand = ySand + 1;
            xSand = xSand - 1;
            continue;
        }
        if (state[ySand+1][xSand+1] === '.') {
            ySand = ySand + 1;
            xSand = xSand + 1;
            continue;
        }
        break;
    }

    state[ySand][xSand] = 'o';
    return true;
};

const state2 = scan.map((row) => [...makeArray(yMax), ...row, ...makeArray(yMax)])
                   .concat([makeArray(xMax-xMin+1+2*yMax), makeArray(xMax-xMin+1+2*yMax, '#')]);

// printMatrix(state2, { delimiter: '' });
grains = 0;
while (true) {
    const res = dropSand2(state2);
    if (res) {
        grains++;
    } else {
        break;
    }
}

console.log(grains);
