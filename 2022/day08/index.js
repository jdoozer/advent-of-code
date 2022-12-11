const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

const trees = input.map(row => row.split('').map(num => +num));
const width = trees[0].length;
const height = trees.length;

const visibleIndicesLeft = [];
const visibleIndicesRight = [];
const visibleIndicesAbove = [];
const visibleIndicesBelow = [];

trees.forEach((treeRow, rowInd) => {
    let maxLeft = { index: 0, value: treeRow[0] };
    let maxRight = { index: width - 1, value: treeRow[width - 1] };
    const visibleLeft = [];
    const visibleRight = [];

    for (let i = 0; i < width; i++) {
        // console.dir({ i, curr: treeRow[i], maxLeft, maxRight})
        const leftInd = i;
        const rightInd = width - 1 - i;
        
        if (treeRow[leftInd] > maxLeft.value) {
            maxLeft = { index: leftInd, value: treeRow[leftInd] };
            visibleLeft.unshift(leftInd);
        }
        if (treeRow[rightInd] > maxRight.value) {
            maxRight = { index: rightInd, value: treeRow[rightInd] };
            visibleRight.unshift(rightInd);
        }
    }
    visibleIndicesLeft.push(visibleLeft);
    visibleIndicesRight.push(visibleRight);
});

trees[0].forEach((_, j) => {
    let maxAbove = { index: 0, value: trees[0][j] };
    let maxBelow = { index: height - 1, value: trees[height - 1][j] };
    const visibleAbove = [];
    const visibleBelow = [];

    for (let i = 0; i < height; i++) {
        const aboveInd = i;
        const belowInd = height - 1 - i;
        
        if (trees[aboveInd][j] > maxAbove.value) {
            maxAbove = { index: aboveInd, value: trees[aboveInd][j] };
            visibleAbove.unshift(aboveInd);
        }
        if (trees[belowInd][j] > maxBelow.value) {
            maxBelow = { index: belowInd, value: trees[belowInd][j] };
            visibleBelow.unshift(belowInd);
        }
    }
    visibleIndicesAbove.push(visibleAbove);
    visibleIndicesBelow.push(visibleBelow);
});


// PART 1
const visibleIndicesByRow = visibleIndicesLeft.map((left, i) => new Set([...left, ...visibleIndicesRight[i]]));
const visibleIndicesByCol = visibleIndicesAbove.map((above, i) => new Set([...above, ...visibleIndicesBelow[i]]));

const isVisible = (rowInd, colInd) => (
    rowInd === 0
    || colInd === 0
    || rowInd === height - 1
    || colInd === width - 1
    || visibleIndicesByRow[rowInd].has(colInd)
    || visibleIndicesByCol[colInd].has(rowInd)
);

const visibleCount = trees.reduce((count, row, rowInd) => {
    const rowVisibleCount = row.reduce((rowCount, _, colInd) => rowCount + (isVisible(rowInd, colInd) ? 1 : 0), 0)
    return count + rowVisibleCount;
}, 0);

console.log(visibleCount)

// PART 2
// console.log(trees)

// const scenicScores = [];
// for (let j = 0; j < height; j++) {
//     scenicScores[j] = [];
//     for (let i = 0; i < width; i++) {
//         const left = i - (visibleIndicesLeft[j].find(x => x < i) || 0);
//         const right = (visibleIndicesRight[j].find(x => x > i) || width - 1) - i;
//         const above = j - (visibleIndicesAbove[i].find(y => y < j) || 0);
//         const below = (visibleIndicesBelow[i].find(y => y > j) || height - 1) - j;

//         console.dir({ i, j, left, right, above, below, score: left * right * above * below })
//         scenicScores[j][i] = left * right * above * below;
//     }
// }

// console.log(scenicScores)

// that didn't work, let's brute force this thing
const visibleAround = [];
for (let j = 0; j < height; j++) {
    visibleAround[j] = [];
    for (let i = 0; i < width; i++) {
        let left = i === 0 ? 0 : 1;
        let right = i === (width - 1) ? 0 : 1;
        let above = j == 0 ? 0 : 1;
        let below = j === (height - 1) ? 0 : 1;

        let nextLeft = i - 1;
        while (nextLeft > 0 && trees[j][nextLeft] < trees[j][i]) {
            left++;
            nextLeft--;
        }

        let nextAbove = j - 1;
        while (nextAbove > 0 && trees[nextAbove][i] < trees[j][i]) {
            above++;
            nextAbove--;
        }

        let nextRight = i + 1;
        while (nextRight < width - 1 && trees[j][nextRight] < trees[j][i]) {
            right++;
            nextRight++;
        }

        let nextBelow = j + 1;
        while (nextBelow < height - 1 && trees[nextBelow][i] < trees[j][i]) {
            below++;
            nextBelow++;
        }

        visibleAround[j][i] = { j, i, left, right, above, below, score: left * right * above * below };
    }
}

// console.log(visibleAround);
const maxScore = Math.max(...visibleAround.flat().map(({ score }) => score));
console.log(maxScore);