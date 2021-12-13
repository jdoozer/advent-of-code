const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

// helpers for both parts
const brackets = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
};
const openBrackets = Object.keys(brackets);


// PART 1
const illegalScores = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
};

function findIllegalChar(line) {
    const currentlyOpen = [];
    for (let char of line) {
        if (openBrackets.includes(char)) {
            currentlyOpen.push(char);
        } else {
            const lastOpen = currentlyOpen.pop();
            if (char !== brackets[lastOpen]) {
                return char;
            }
        }
    }
    return null;
}

const illegalScore = input.reduce((runningScore, line) => {
    const illegalChar = findIllegalChar(line);
    return runningScore + (illegalChar ? illegalScores[illegalChar] : 0);
}, 0);

console.log(illegalScore);

// PART 2
const incompleteScores = {
    '(': 1,
    '[': 2,
    '{': 3,
    '<': 4,
};

function findOpenBrackets(line) {
    const currentlyOpen = [];
    for (let char of line) {
        if (openBrackets.includes(char)) {
            currentlyOpen.push(char);
        } else {
            const lastOpen = currentlyOpen.pop();
            if (char !== brackets[lastOpen]) {
                return [];
            }
        }
    }
    return currentlyOpen;
}

function calcScoreForIncomplete(leftOpen) {
    return leftOpen.reverse().reduce(
        (score, openBracket) => score * 5 + incompleteScores[openBracket], 0);
}

const allIncompleteScores = input.map(line => calcScoreForIncomplete(findOpenBrackets(line)));

const sortedScores = allIncompleteScores.filter(score => score).sort((a, b) => a - b);

console.log(sortedScores[(sortedScores.length - 1)/2]);
