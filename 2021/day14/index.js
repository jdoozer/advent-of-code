const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test, delimiter: '\n\n' });

// helpers for both parts
const template = input[0].split('');
const rules = input[1].split('\n').reduce((rulesObj, ruleStr) => {
    const [initialPair, insert] = ruleStr.split(' -> ');
    rulesObj[initialPair] = [initialPair[0] + insert, insert + initialPair[1]];
    return rulesObj;
}, {});

const initialPairCounts = {};
for (let i = 0; i < template.length - 1; i++) {
    const pair = (template[i] + template[i+1]);
    initialPairCounts[pair] = (initialPairCounts[pair] || 0) + 1;
}

function step(inputPairCounts) {
    const pairCounts = {};
    for (const [pair, count] of Object.entries(inputPairCounts)) {
        const outputPairs = rules[pair];
        for (const outputPair of outputPairs) {
            pairCounts[outputPair] = (pairCounts[outputPair] || 0) + count;
        }
    }
    return pairCounts;
}

function pairCountsToLetterCounts(pairCounts) {
    const letterCounts = {};
    for (const [pair, count] of Object.entries(pairCounts)) {
        const letters = pair.split('');
        for (const letter of letters) {
            letterCounts[letter] = (letterCounts[letter] || 0) + count;
        }
    }
    for (const [letter, letterCount] of Object.entries(letterCounts)) {
        letterCounts[letter] = Math.ceil(letterCount / 2);
    }
    return letterCounts;
}

// PART 1 and 2
const PART_1_STEPS = 10;
const PART_2_STEPS = 40;

let pairCounts = initialPairCounts;
for (let i = 0; i < PART_2_STEPS; i++) {
    pairCounts = step(pairCounts);
}

const letterCounts = pairCountsToLetterCounts(pairCounts);
const mostCommon = Math.max(...Object.values(letterCounts));
const leastCommon = Math.min(...Object.values(letterCounts));
console.log(mostCommon - leastCommon);

// PART 2
