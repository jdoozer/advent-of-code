const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const testIndex = parseInt(process.argv[3] || 0, 10);

const testStrings = [
    'mjqjpqmgbljsphdztnvjfqwrcgsmlb', // index 0 => 7, 19
    'bvwbjplbgvbhsrlpgdmjqwftvncz', // index 1 => 5, 23
    'nppdvjthqldpwncqszvftbrmjlhg', // index 2 => 6, 23
    'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', // index 3 => 10, 29
    'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', // index 4 => 11, 26
];

const input = test ? testStrings[testIndex] : loadInput({})[0];

// helpers
const isUnique = str => (new Set(str)).size === str.length;

// PART 1
const SEQ_LENGTH_1 = 4;
let endIndex = SEQ_LENGTH_1;
while (endIndex < input.length) {
    if (isUnique(input.substring(endIndex - (SEQ_LENGTH_1 - 1), endIndex + 1))) {
        break;
    }
    endIndex++;
}
console.log(endIndex + 1);

// PART 2
const SEQ_LENGTH_2 = 14;
endIndex = SEQ_LENGTH_2;
while (endIndex < input.length) {
    if (isUnique(input.substring(endIndex - (SEQ_LENGTH_2 - 1), endIndex + 1))) {
        break;
    }
    endIndex++;
}
console.log(endIndex + 1);
