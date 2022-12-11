const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test, delimiter: '\n\n' });

const [crateData, moveData] = input;


// helpers
const crateRegex = /(\s*)\[(\w)\]/g;
const crateDataRows = crateData.split('\n');
const numStacks = crateDataRows[crateDataRows.length - 1].trim().split(/\s*/).length;

// PART 1
// initialize data structure
let crateStacks = {};
for (let i = 1; i <= numStacks; i++) {
    crateStacks[i] = [];
}

// initialize crate positions
crateDataRows.slice(0, -1).forEach(crateRow => {
    let currStack = 0;
    const crateMatches = [...(' ' + crateRow).matchAll(crateRegex)];
    crateMatches.forEach((crateMatch) => {
        const crateId = crateMatch[2];
        const nextStack = currStack + 1 + (crateMatch[1].length - 1) / 4;
        crateStacks[nextStack].unshift(crateId);
        currStack = nextStack;
    });    
});

// do the moves
moveData.split('\n').forEach((moveRow => {
    const [_, cratesStr, start, end] = /move (\d+) from (\d+) to (\d+)/g.exec(moveRow);
    const cratesToMove = parseInt(cratesStr, 10);

    for (let j = 1; j <= cratesToMove; j++) {
        const crate = crateStacks[start].pop();
        crateStacks[end].push(crate);
    }
    // console.log(crateStacks);
}));

let stackTops = [];
for (let i = 1; i <= numStacks; i++) {
    stackTops.push(crateStacks[i].slice(-1));
}
console.log(stackTops.flat().join(''));


// PART 2
// initialize data structure
crateStacks = {};
for (let i = 1; i <= numStacks; i++) {
    crateStacks[i] = [];
}

// initialize crate positions
crateDataRows.slice(0, -1).forEach(crateRow => {
    let currStack = 0;
    const crateMatches = [...(' ' + crateRow).matchAll(crateRegex)];
    crateMatches.forEach((crateMatch) => {
        const crateId = crateMatch[2];
        const nextStack = currStack + 1 + (crateMatch[1].length - 1) / 4;
        crateStacks[nextStack].unshift(crateId);
        currStack = nextStack;
    });    
});

// do the moves
moveData.split('\n').forEach((moveRow => {
    const [_, cratesStr, start, end] = /move (\d+) from (\d+) to (\d+)/g.exec(moveRow);
    const numCratesToMove = parseInt(cratesStr, 10);

    const cratesToMove = crateStacks[start].slice(-numCratesToMove);
    crateStacks[start] = crateStacks[start].slice(0, -numCratesToMove);
    crateStacks[end] = crateStacks[end].concat(cratesToMove);

    // console.log(crateStacks);
}));

stackTops = [];
for (let i = 1; i <= numStacks; i++) {
    stackTops.push(crateStacks[i].slice(-1));
}
console.log(stackTops.flat().join(''));
