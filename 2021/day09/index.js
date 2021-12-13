const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

// helpers for both parts
const floor = input.map(row => row.split(''));

const xMax = floor[0].length - 1;
const yMax = floor.length - 1;

const lowPoints = floor.reduce((lowPts, row, y) => {
    const ptsInRow = row.reduce((lowPtsInRow, point, x) => {
        if ((x === 0 || point < row[x-1])
            && (x === xMax || point < row[x+1])
            && (y === 0 || point < floor[y-1][x])
            && (y === yMax || point < floor[y+1][x])) {
                lowPtsInRow.push({ x, y, value: point })
            }
        return lowPtsInRow;
    }, []);
    return lowPts.concat(ptsInRow);
}, []);

// PART 1
const riskLevel = lowPoints.length + lowPoints.reduce((sum, pt) => sum + parseInt(pt.value), 0);

console.log(riskLevel);

// PART 2
// this function generates a unique key for each point so we can track our points in a set
const key = (x, y) => x + y * (xMax + 1);

function findBasinSize(lowPoint) {
    // we want to keep a stack of points to check, and a set of points that we know are in basin
    const { x: xInit, y: yInit } = lowPoint;

    // initialize our "basin" set with the starting low point
    let basin = new Set([key(xInit, yInit)]);
    
    // initialize our "points to check" stack with the pts around starting point (and make a helper fn)
    let pointsToCheck = [];
    function addSurroundingPoints(x, y) {
        if (x !== 0 && !basin.has(key(x-1, y))) pointsToCheck.push([x - 1, y]);
        if (x !== xMax && !basin.has(key(x+1, y))) pointsToCheck.push([x + 1, y]);
        if (y !== 0 && !basin.has(key(x, y-1))) pointsToCheck.push([x, y - 1]);
        if (y !== yMax && !basin.has(key(x, y+1))) pointsToCheck.push([x, y + 1]);
    }
    addSurroundingPoints(xInit, yInit);
    
    while (pointsToCheck.length) {
        const [xCurr, yCurr] = pointsToCheck.pop();
        if (floor[yCurr][xCurr] !== '9') {
            addSurroundingPoints(xCurr, yCurr);
            basin.add(key(xCurr, yCurr));
        }
    }

    return basin.size;
}

const basinSizes = lowPoints.map(point => findBasinSize(point));
basinSizes.sort((a, b) => b - a); // sort largest first

console.log(basinSizes[0] * basinSizes[1] * basinSizes[2])