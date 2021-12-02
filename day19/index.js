const loadInput = require('../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const [rulesStr, messagesStr] = loadInput({ test, delimiter: '\n\n' });

// START CODE FOR DAY'S PUZZLES HERE
const ruleRegEx = /(?<ruleId>\d+): ("(?<letter>\w)"|(?<subrules>[\d |]+))/;

const ruleArr = rulesStr.split('\n');
const messages = messagesStr.split('\n');

const rules = {};
ruleArr.forEach(rule => {
    const { ruleId, letter, subrules } = rule.match(ruleRegEx).groups;
    rules[ruleId] = { letter, subrules: subrules && subrules.split('|')};
});

const getMatchesForRule = (ruleId) => {
    const { letter, subrules } = rules[ruleId];
    if (letter) return letter;
    const matches = subrules.map(subrule => subrule.trim()
        .split(' ')
        .reduce((ruleStr, subruleId) => ruleStr + getMatchesForRule(subruleId), '')
    );
    return `(?:${matches.join('|')})`;
}

const getMatchingMsgCount = (matchFn) => messages.reduce((sum, msg) => sum + (matchFn(msg) ? 1 : 0), 0);


// PART 1
const matchRegEx = new RegExp(`^${getMatchesForRule(0)}$`);
console.log(getMatchingMsgCount((msg) => matchRegEx.test(msg)));


// PART 2
// 0: 8 11
// 8: 42 | 42 8
// 11: 42 31 | 42 11 31
// so rule 0 means we want any number of 42's followed by a smaller number of 31's
const rule42 = getMatchesForRule(42);
const rule31 = getMatchesForRule(31);
const overallRegex = new RegExp(`^(${rule42}+)(${rule31}+)$`);

const checkPart2Match = (msg) => {
    const match = msg.match(overallRegex);
    if (match) {
        const [_, rule42Section, rule31Section] = match;
        const rule42Match = rule42Section.match(new RegExp(rule42, 'g'));
        const rule31Match = rule31Section.match(new RegExp(rule31, 'g'));
        return (rule42Match.length > rule31Match.length);
    }
    return false;
}

console.log(getMatchingMsgCount(checkPart2Match));
