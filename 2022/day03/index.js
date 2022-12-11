const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

// helpers
const unique = (arr) => [...new Set(arr)];

const findMatch = (arr1, arr2) => arr1.find(x => arr2.includes(x));

const findCommon = (str1, str2, str3) => {
    const arr1 = unique(str1);
    const arr2 = unique(str2);
    const arr3 = unique(str3);
    const common12 = arr1.filter(char => arr2.includes(char));
    return findMatch(common12, arr3);
}

const priority = (char) => char === char.toLowerCase() ? char.charCodeAt() - 96 : char.charCodeAt() - 38;

// PART 1
const commonBetweenCompartments = input.map(row => {
    const firstCompartment = row.slice(0, row.length/2)
    const secondCompartment = row.slice(row.length/2);
    return findMatch(unique(firstCompartment), unique(secondCompartment));
});
// console.log(commonBetweenCompartments);

const part1total = commonBetweenCompartments.reduce((sum, char) => sum + priority(char), 0);
console.log(part1total)

// PART 2
const groups = input.reduce((groups, row) => {
    if (groups[groups.length - 1].length < 3) {
        groups[groups.length - 1].push(row);
    } else {
        groups.push([row]);
    }
    return groups;
}, [[]]);

const badges = groups.map((group) => findCommon(...group));

const part2total = badges.reduce((sum, char) => sum + priority(char), 0);
console.log(part2total)
