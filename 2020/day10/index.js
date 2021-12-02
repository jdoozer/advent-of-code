const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const joltageRatings = loadInput({ test, number: true });

// START CODE FOR DAY'S PUZZLES HERE
joltageRatings.sort((a, b) => a - b);

const joltJumps = joltageRatings.reduce((jumps, adapter, ind, arr) => {
    const jumpSize = (adapter - (arr[ind - 1] || 0));
    jumps[jumpSize] ? ++jumps[jumpSize] : jumps[jumpSize] = 1;
    return jumps;
}, {});


// jump to device at end is always 3
joltJumps[3] += 1;

console.log(joltJumps[1] * joltJumps[3]);

// part 2
joltageRatings.unshift(0);

const findPathsToAdapter = (ratings) => {
    let pathsToAdapter = new Array(ratings.length).fill(0);

    ratings.forEach((rating, i) => {
        switch (i) {
            case 0: // bad base cases oooops
            case 1:
                pathsToAdapter[i] = 1;
                break;
            case 2:
                pathsToAdapter[i] = 2;
                break;
            default:
                pathsToAdapter[i] = pathsToAdapter[i-1];
                if ((rating - ratings[i-1]) === 1 && (rating - ratings[i-2]) === 2) {
                    pathsToAdapter[i] += pathsToAdapter[i-2];
                    if ((rating - ratings[i-3]) === 3) {
                        pathsToAdapter[i] +=  pathsToAdapter[i-3];
                    }
                }
                break;
        }
    });

    return pathsToAdapter.slice(-1)[0];
}

const possibleCombos = findPathsToAdapter(joltageRatings);

console.log(possibleCombos);
