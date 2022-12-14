const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test, delimiter: '\n\n' });

const packetPairs = input.map((pair) => pair.split('\n').map(str => JSON.parse(str)));

function isCorrectOrder(left, right) {
    if (typeof left === 'number') {
        if (typeof right === 'number') {
            return (left === right) ? 'continue' : left < right;
        } else {
            return isCorrectOrder([left], right);
        }
    } else {
        if (typeof right === 'number') {
            return isCorrectOrder(left, [right]);
        } else {
            if (left.length) {
                if (right.length) {
                    const firstComp = isCorrectOrder(left[0], right[0]);
                    return (left.length === 1 && right.length === 1) || firstComp !== 'continue'
                        ? firstComp
                        : isCorrectOrder(left.slice(1), right.slice(1));
                }
                return false;
            } else {
                return !!right.length || 'continue';
            }
        }
    }    
}

// PART 1
const correctPairs = packetPairs.flatMap(([pairLeft, pairRight], ind) => 
    isCorrectOrder(pairLeft, pairRight) ? ind + 1 : []
);

const correctPairsSum = correctPairs.reduce((sum, index) => sum + index, 0);

console.log(correctPairsSum)

// PART 2
const allPackets = packetPairs.flat().concat([[[2]], [[6]]]);
function isSmaller(left, right) {
    const res = isCorrectOrder(left, right);
    if (res === 'continue') return 0;
    return res ? -1 : 1;
}
allPackets.sort(isSmaller);

const dividerPacket1 = allPackets.findIndex(packet => JSON.stringify(packet) === '[[2]]') + 1;
const dividerPacket2 = allPackets.findIndex(packet => JSON.stringify(packet) === '[[6]]') + 1;

console.log(dividerPacket1 * dividerPacket2);