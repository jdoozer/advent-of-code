const loadInput = require('../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const layoutStrings = loadInput({ test });

// START CODE FOR DAY'S PUZZLES HERE
const initialLayout = layoutStrings.map(str => {
    const arr = new Array(str.length);
    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        if (char === '.') arr[i] = null;
        else arr[i] = (char === '#') ? 1 : 0;
    }
    return arr;
});

const printLayout = (layout) => layout.map(row => {
    let rowStr = row.join('x');
    if (rowStr.charAt(rowStr.length - 1) === 'x') rowStr = rowStr.padEnd(rowStr.length + 1, 'x');
    if (rowStr.charAt(0) === 'x') rowStr = rowStr.padStart(rowStr.length + 1, 'x');

    return (
        rowStr.replace(/1/g, '#')
            .replace(/0/g, 'L')
            .replace(/xxxxxx/g, '.....')
            .replace(/xxxxx/g, '....')
            .replace(/xxxx/g, '...')
            .replace(/xxx/g, '..')
            .replace(/xx/g, '.')
            .replace(/x/g, '')
    )
}).join('\n') + '\n----------------------------';

const areLayoutsEqual = (layout1, layout2) => (
    layout1.every((rowLayout, row) => {
        return rowLayout.every((position, col) => position === layout2[row][col])
    })
);

const countOccupiedSeats = (layout) => layout.reduce((seats, rowLayout) => seats + rowLayout.reduce((seatsInRow, pos) => seatsInRow + (pos || 0), 0), 0);


// part 1
const calcNextStep = (layout) => {
    const countOccupiedNeighbors = (row, col) => (
        (row > 0 ? ((layout[row-1][col-1] || 0) + layout[row-1][col] + (layout[row-1][col+1] || 0)) : 0) +
        (layout[row][col-1] || 0) + (layout[row][col+1] || 0) +
        ((row < layout.length - 1) ? ((layout[row+1][col-1] || 0) + layout[row+1][col] + (layout[row+1][col+1] || 0)) : 0)
    );

    return layout.map((rowLayout, row) => rowLayout.map((pos, col) => {
        if (pos === 0 && countOccupiedNeighbors(row, col) === 0) return 1;
        if (pos && countOccupiedNeighbors(row, col) >= 4) return 0;
        return pos;
    }));
};


let layout = initialLayout.map(row => [...row]);
let nextLayout = calcNextStep(layout);

while (!areLayoutsEqual(layout, nextLayout)) {
    layout = nextLayout;
    nextLayout = calcNextStep(layout);
}

console.log(countOccupiedSeats(layout));


// part 2
const calcNextStepAdjusted = (layout) => {
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    const inBounds = (row, col) => row >= 0 && row < layout.length && col >= 0 && col < layout[0].length;

    const countOccupiedNeighbors = (row, col) => {
        let currRow, currCol;
        return directions.reduce((sum, direction) => {
            currRow = row + direction[0];
            currCol = col + direction[1];
            while (inBounds(currRow, currCol)) {
                if (layout[currRow][currCol]) return sum + 1;
                if (layout[currRow][currCol] === 0) return sum;
                currRow += direction[0];
                currCol += direction[1];
            }
            return sum;
        }, 0);
    };


    return layout.map((rowLayout, row) => rowLayout.map((pos, col) => {
        if (pos === 0 && countOccupiedNeighbors(row, col) === 0) return 1;
        if (pos && countOccupiedNeighbors(row, col) >= 5) return 0;
        return pos;
    }));
};

layout = initialLayout.map(row => [...row]);
nextLayout = calcNextStepAdjusted(layout);

while (!areLayoutsEqual(layout, nextLayout)) {
    // console.log(printLayout(nextLayout))
    layout = nextLayout;
    nextLayout = calcNextStepAdjusted(layout);
}

console.log(countOccupiedSeats(layout));
