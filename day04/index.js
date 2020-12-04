const loadInput = require('../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const passportList = loadInput({ test, delimiter: '\n\n' });

// START CODE FOR DAY'S PUZZLES HERE
const fields = [
    'byr',
    'iyr',
    'eyr',
    'hgt',
    'hcl',
    'ecl',
    'pid',
];

const regex1 = new RegExp(`((${fields.join('|')}):\\S+\\s?){${fields.length}}`, 'm');
const regex2 = new RegExp(`((${fields.join('|')}|cid):\\S+\\s?){${fields.length + 1}}`, 'm');

const isPassportValid = (passport) => regex1.test(passport) || regex2.test(passport);

const passportCountByCheck = (validCheckFn) => passportList.reduce(
    (validCount, passport) => validCount + (validCheckFn(passport) ? 1 : 0),
    0
);

const validPassportCount = passportCountByCheck(isPassportValid);
// const validPassportCount = passportList.reduce(
//     (validCount, passport) => validCount + (isPassportValid(passport) ? 1 : 0),
//     0
// );

console.log(validPassportCount);

// part 2

// byr (Birth Year) - four digits; at least 1920 and at most 2002.
// iyr (Issue Year) - four digits; at least 2010 and at most 2020.
// eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
// hgt (Height) - a number followed by either cm or in:
// If cm, the number must be at least 150 and at most 193.
// If in, the number must be at least 59 and at most 76.
// hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
// ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
// pid (Passport ID) - a nine-digit number, including leading zeroes.
// cid (Country ID) - ignored, missing or not.

const fieldValidations = [
    /byr:(19[2-9][0-9]|200[0-2])/m,
    /iyr:(20(1[0-9]|20))/m,
    /eyr:(20(2[0-9]|30))/m,
    /hgt:(1([5-8][0-9]|9[0-3])cm|(59|6[0-9]|7[0-6])in)/m,
    /hcl:#([0-9a-f]){6}/m,
    /ecl:(amb|blu|brn|gry|grn|hzl|oth)/m,
    /pid:([0-9]){9}/m,
];

const isPassportValidStrict = (passport) => fieldValidations.every(regex => regex.test(passport));

const validPassportCountStrict = passportCountByCheck(isPassportValidStrict);

console.log(validPassportCountStrict)
