const loadInput = require('../../lib/loadInput');
const printMatrix = require('../../lib/printMatrix');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

let xMin = Infinity;
let yMin = Infinity;
let xMax = 0;
let yMax = 0;
const positions = [];

// first parse to find x,y positions of all sensors and beacons and find matrix bounds
input.forEach((row) => {
    const match = row.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/);
    const [sx, sy, bx, by] = match.slice(1, 5).map(str => +str);

    const dist = Math.abs(sx - bx) + Math.abs(sy - by);
    positions.push({ sx, sy, bx, by, dist });

    xMin = Math.min(xMin, sx - dist, bx);
    xMax = Math.max(xMax, sx + dist, bx);
    yMin = Math.min(yMin, sy - dist, by);
    yMax = Math.max(yMax, sy + dist, by);
});

const yMap = (test ? 10 : 2000000) - yMin;
const beaconMapRow = new Array(xMax-xMin+1).fill('.');
positions.forEach(({ sx, sy, bx, by, dist }) => {
    // let's just shift everything for simplicity
    const sxMap = sx - xMin;
    const syMap = sy - yMin;
    const bxMap = bx - xMin;
    const byMap = by - yMin;
    if (byMap === yMap) beaconMapRow[bxMap] = 'B';
    if (syMap === yMap) beaconMapRow[sxMap] = 'S';

    const yDist = Math.abs(yMap - syMap);
    if (yDist > dist) return;

    const xDist = dist - yDist;
    for (let xCurr = sxMap - xDist; xCurr <= sxMap + xDist; xCurr++) {
        // console.dir({ yCurr, xCurr, sxMap, syMap, dist })
        if (beaconMapRow[xCurr] === '.') beaconMapRow[xCurr] = '#';
    }
});

const noBeaconSpots = beaconMapRow.reduce((count, curr) => count + (curr === '#' ? 1 : 0), 0);

console.log(noBeaconSpots);

// PART 2
const getTuningFrequency = (x, y) => x * 4000000 + y;
const maxBeacon = test ? 20 : 4000000;

const remove = (ranges, removeRange) => {
    const outputRanges = [];
    for (const range of ranges) {
        // no overlap
        if (range[0] > removeRange[1] || range[1] < removeRange[0]) {
            outputRanges.push(range);
            continue;
        }
        // removeRange fully includes range
        if (removeRange[0] <= range[0] && removeRange[1] >= range[1]) continue;
        // range fully includes removeRange
        if (range[0] < removeRange[0] && range[1] > removeRange[1]) {
            outputRanges.push([range[0], removeRange[0] - 1]);
            outputRanges.push([removeRange[1] + 1, range[1]]);
            continue;
        }
        // overlap at bottom of range
        if (removeRange[0] <= range[0] && range[1] > removeRange[1]) {
            outputRanges.push([removeRange[1] + 1, range[1]]);
            continue;
        }
        // overlap at top of range
        if (range[0] < removeRange[0] && removeRange[1] >= range[1]) {
            outputRanges.push([range[0], removeRange[0] - 1]);
            continue;
        }
    }
    return outputRanges;
}

let beacon = null;
for (let y = 0; y < maxBeacon; y++) {
    let beaconRanges = [[0, maxBeacon + 1]];
    for (const { sx, sy, bx, by, dist } of positions) {
        const yDist = Math.abs(y - sy);
        if (yDist > dist) continue;

        const xDist = dist - yDist;
        beaconRanges = remove(beaconRanges, [sx - xDist, sx + xDist]);
        if (by === y) beaconRanges = remove(beaconRanges, [bx, bx]);

        if (beaconRanges.length === 0) continue;
    }
    if (beaconRanges.length) {
        beacon = { x: beaconRanges[0][0], y};
        break;
    }
}

if (beacon) {
    const freq = getTuningFrequency(beacon.x, beacon.y);
    console.dir({ beacon, freq });
} else {
    console.log('Could not find beacon')
}
