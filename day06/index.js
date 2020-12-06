const loadInput = require('../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const groups = loadInput({ test, delimiter: '\n\n' });

// START CODE FOR DAY'S PUZZLES HERE
const groupCountAny = (group) => {
    const uniqueQuestionList = new Set(group.split('\n').join(''));
    return uniqueQuestionList.size;
};

const groupCountEvery = (group) => {
    let questions = {};
    const people = group.split('\n');
    
    people.forEach(person => {
        person.split('').forEach(value => {
            if (questions[value]) {
                ++questions[value];
            } else {
                questions[value] = 1;
            }
        })
    });

    return Object.keys(questions).reduce(
        (sum, key) => sum + ((questions[key] === people.length) ? 1 : 0),
        0
    );
};

// part 1
const groupSumAny = groups.reduce((sum, group) => sum + groupCountAny(group), 0);

console.log(groupSumAny);


// part 2
const groupSumEvery = groups.reduce((sum, group) => sum + groupCountEvery(group), 0);

console.log(groupSumEvery);
