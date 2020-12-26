const loadInput = require('../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const input = loadInput({ test });

// START CODE FOR DAY'S PUZZLES HERE
const lastOpRegex = /[+*](?![\s\S]*[+*])/;

// PART 1 SPLITTING FUNCTION
const splitOperatorParens = (mathStr) => {
    let currStr = mathStr;
    if (mathStr.endsWith(')')) {
        const openParenInd = findOpenParen(mathStr);
        currStr = mathStr.slice(0, openParenInd);
    }
    return currStr.search(lastOpRegex);
}

// PART 2 SPLITTING FUNCTION
const splitOperatorParensAddPrecedence = (mathStr) => {
    let currStr = mathStr;
    let splitOpPos = currStr.length;

    while (splitOpPos >= 0) {
        if (currStr.charAt(splitOpPos) === '*') {
            return splitOpPos;
        }
        currStr = currStr.slice(0, splitOpPos);
        if (currStr.endsWith(')')) {
            const openParenInd = findOpenParen(currStr);
            currStr = currStr.slice(0, openParenInd);
        }
        splitOpPos = currStr.search(lastOpRegex);
    }

    return splitOperatorParens(mathStr);
}


// SHARED CODE
class Node {
    constructor(operator, left, right) {
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}

const findOpenParen = (str) => {
    let parenCount = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        if (str.charAt(i) === ')') parenCount++;
        if (str.charAt(i) === '(') parenCount--;
        if (parenCount === 0) return i;
    }
}

const makeMathTree = (mathStr, splitFn) => {
    if (mathStr.length === 1) return parseInt(mathStr, 10);

    if (mathStr.endsWith(')') && findOpenParen(mathStr) === 0) {
        return makeMathTree(mathStr.slice(1, -1), splitFn);
    }

    const splitOpPos = splitFn(mathStr);

    const operator = mathStr.charAt(splitOpPos);
    const left = makeMathTree(mathStr.slice(0, splitOpPos), splitFn);
    const right = makeMathTree(mathStr.slice(splitOpPos + 1), splitFn);

    return new Node(operator, left, right);
}

const evalMathTree = (mathTree) => {
    if (typeof mathTree === 'number') return mathTree;
    return (mathTree.operator === '+')
        ? evalMathTree(mathTree.left) + evalMathTree(mathTree.right)
        : evalMathTree(mathTree.left) * evalMathTree(mathTree.right);
}

const evalMathLine = (inputLine, splitFn) => {
    const inputLineParsed = inputLine.replace(/\s/g, '');
    const mathTree = makeMathTree(inputLineParsed, splitFn);
    return evalMathTree(mathTree);
}

const sumLinesPart1 = input.reduce((sum, line) => evalMathLine(line, splitOperatorParens) + sum, 0);
const sumLinesPart2 = input.reduce((sum, line) => evalMathLine(line, splitOperatorParensAddPrecedence) + sum, 0);

console.log(sumLinesPart1);
console.log(sumLinesPart2);
