const loadInput = require('../../lib/loadInput');
const printMatrix = require('../../lib/printMatrix');

const test = (process.argv[2] === 'test');
const input = loadInput({ test, delimiter: '\n' });

const uniqueRockPaths = [...new Set(input)];

const allSegments = uniqueRockPaths.reduce((segments, path) => {
    const points = path.split(' -> ').map((point) => point.split(',').map((str) => +str));
    points.forEach((point, i) => {
        if (i > 0) {
            segments.push([point, points[i-1]]);
        }
    });
    return segments;
}, []);

const { xMin, yMin, xMax, yMax } = allSegments.reduce((range, [[x1, y1], [x2, y2]]) => {
    range.xMin = Math.min(range.xMin, x1, x2);
    range.yMin = Math.min(range.yMin, y1, y2);
    range.xMax = Math.max(range.xMax, x1, x2);
    range.yMax = Math.max(range.yMax, y1, y2);
    return range;
}, { xMin: Infinity, yMin: Infinity, xMax: 0, yMax: 0 });

const scan = new Array(yMax+1).fill().map(_ => new Array(xMax-xMin+1).fill().map(_ => '.'));
allSegments.forEach((segment, i) => {
    const [[x1, y1], [x2, y2]] = segment;
    if (y1 === y2) {
        const xRange = [x1, x2].sort();
        for (let x = xRange[0]; x <= xRange[1]; x++) {
            scan[y1][x - xMin] = '#';
        }
    } else if (x1 === x2) {
        const yRange = [y1, y2].sort();
        for (let y = yRange[0]; y <= yRange[1]; y++) {
            scan[y][x1 - xMin] = '#';
        }
    } else {
        console.dir({ xMin, yMin, xMax, yMax })
        throw new Error('segments must be horizontal or vertical')
    }
});

// printMatrix(scan, { delimiter: ''})

const sandSourceX = 500 - xMin;
const dropSand = (state) => {
    let xSand = sandSourceX;
    let ySand = 0;

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

    // console.dir({ xSand, ySand, xMin, xMax })
    if (ySand > yMax || xSand <= 0 || xSand >= (xMax - xMin)) {
        return false;
    }
    state[ySand][xSand] = 'o';
    return true;
};

const state = scan.map(row => [...row]);
// printMatrix(state, { delimiter: ''})

let grains = 0;
while (true) {
    const res = dropSand(state);
    if (res) {
        grains++;
    } else {
        break;
    }
}

printMatrix(state, { delimiter: ''})
console.log(grains);
