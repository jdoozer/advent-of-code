const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const rules = loadInput({ test });

// START CODE FOR DAY'S PUZZLES HERE
const emptyContents = 'no other bags';

const ruleRegExContainer = /(\w+ \w+) bags contain ((?:.+\b)+)./;
const ruleRegExContents = /([0-9]+) (\w+ \w+) bag/g;

let bagContainers = {};
let bagContents = {};

rules.forEach(rule => {
    const [_, containerColor, contents] = ruleRegExContainer.exec(rule);
    if (contents !== emptyContents) {
        let nextMatch = ruleRegExContents.exec(contents);
        while (nextMatch !== null) {
            const [_, qty, color] = nextMatch;
            nextMatch = ruleRegExContents.exec(contents);

            // add to bagContainers object
            if (bagContainers[color]) {
                bagContainers[color].push(containerColor);
            } else {
                bagContainers[color] = [containerColor];
            }

            // add to bagContents object
            if (!bagContents[containerColor]) {
                bagContents[containerColor] = [];
            }
            bagContents[containerColor].push({ color, qty: parseInt(qty, 10) });

        }
    }
});


// part 1
let colorsToCheck = bagContainers['shiny gold'];
let containerColors = new Set();
let nextColor;

if (colorsToCheck) {
    while (colorsToCheck.length > 0) {
        nextColor = colorsToCheck.pop();
        containerColors.add(nextColor);
        if (bagContainers[nextColor]) {
            colorsToCheck = colorsToCheck.concat(bagContainers[nextColor]);
        }
    }
}

console.log(containerColors.size)

// part 2
const getQtyBagsInside = (outerColor) => {
    const contents = bagContents[outerColor];
    if (!contents) return 0;
    return contents.reduce((sum, { color, qty }) => sum + qty * (1 + getQtyBagsInside(color)), 0);
}

console.log(getQtyBagsInside('shiny gold'));
