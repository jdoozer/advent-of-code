const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test, delimiter: '\n\n' });

const crazyLongRegex = /Monkey (?<monkeyStr>\d+):\s+Starting items: (?<itemsStr>(?:\d+, )*\d+)\s+Operation: new = old (?<operatorStr>[*+-/]) (?<operandStr>old|\d+)\s+Test: divisible by (?<testDivisorStr>\d+)\s+If true: throw to monkey (?<nextMonkeyTrueStr>\d+)\s+If false: throw to monkey (?<nextMonkeyFalseStr>\d+)/;

function makeOperation(operatorStr, operandStr) {
    return (x) => {
        const operand = (operandStr === 'old') ? x : +operandStr;
        switch (operatorStr) {
            case '+':
                return x + operand;
            case '*':
                return x * operand;
            case '-':
                return x - operand;
            case '/':
                return x / operand;
        }
    }
}

function handleTurn(monkeys, ind, handleItemFn) {
    const monkey = monkeys[ind];
    while (monkey.items.length) {
        const { item, throwTo } = handleItemFn(monkey);
        monkeys[throwTo].items.push(item);
        monkey.inspectCount += 1;
    }
    return monkeys;
}

// initialize data structure
let monkeys = [];

for (const monkeyInput of input) {
    const { monkeyStr, itemsStr, operatorStr, operandStr, testDivisorStr, nextMonkeyTrueStr, nextMonkeyFalseStr } = crazyLongRegex.exec(monkeyInput)?.groups || {};

    const items = itemsStr.split(', ').map(str => +str)

    monkeys[monkeyStr] = {
        items,
        startingItems: [...items],
        operation: makeOperation(operatorStr, operandStr),
        testDivisor: +testDivisorStr,
        getNextMonkey: res => res ? nextMonkeyTrueStr : nextMonkeyFalseStr,
        inspectCount: 0,
    }
}

// PART 1
function handleItem1({ items, operation, testDivisor, getNextMonkey }) {
    const item = items.shift();
    const inspected = operation(item);
    const worryLevel = Math.floor(inspected / 3);
    const throwTo = getNextMonkey(worryLevel % testDivisor === 0);
    return { item: worryLevel, throwTo };
}

// run 20 rounds
for (let i = 0; i < 20; i++) {
    for (let m = 0; m < monkeys.length; m++) {
        monkeys = handleTurn(monkeys, m, handleItem1);
    }
}

const activeMonkeys = monkeys.map(monkey => monkey.inspectCount).sort((a, b) => b - a);
console.log(activeMonkeys[0] * activeMonkeys[1]);

// PART 2
// reset monkeys back to initial state
monkeys = monkeys.map(monkey => ({ ...monkey, items: [...monkey.startingItems], inspectCount: 0 }));

const lcm = monkeys.reduce((product, { testDivisor }) => product * testDivisor, 1);

function handleItem2({ items, operation, testDivisor, getNextMonkey }) {
    const item = items.shift();
    const worryLevel = operation(item) % lcm; // taking only remainder does not affect results for any testDivisor
    const throwTo = getNextMonkey(worryLevel % testDivisor === 0);
    return { item: worryLevel, throwTo };
}

// run 10000 rounds
for (let i = 0; i < 10000; i++) {
    for (let m = 0; m < monkeys.length; m++) {
        monkeys = handleTurn(monkeys, m, handleItem2);
    }
}

const activeMonkeys2 = monkeys.map(monkey => monkey.inspectCount).sort((a, b) => b - a);
console.log(activeMonkeys2[0] * activeMonkeys2[1]);
