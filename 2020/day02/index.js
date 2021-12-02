const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

const regex = /(\d+)-(\d+) (\w+): (\w+)/;

// PART 1
let validPasswordCount1 = 0;

input.forEach(inputData => {
    const [_, minString, maxString, keyLetter, password] = inputData.match(regex);
    const passwordChars = password.split('');
    const keyLetterCount = passwordChars.reduce((count, char) => (char === keyLetter) ? count+1 : count, 0);
    if (keyLetterCount >= parseInt(minString) && keyLetterCount <= parseInt(maxString)) {
        validPasswordCount1++;
    }
});

console.log(validPasswordCount1);


// PART 2
let validPasswordCount2 = 0;

input.forEach(inputData => {
    const [_, firstPos, secondPos, keyLetter, password] = inputData.match(regex);
    const firstPosCheck = password[parseInt(firstPos) - 1] === keyLetter;
    const secondPosCheck = password[parseInt(secondPos) - 1] === keyLetter;
    if ((firstPosCheck && !secondPosCheck) || (!firstPosCheck && secondPosCheck)) {
        validPasswordCount2++;
    }
});

console.log(validPasswordCount2);
