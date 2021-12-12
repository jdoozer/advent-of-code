const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

const difference = (a, b) => [...a].filter(x => !b.has(x));
const union = (a, b) => [...a, ...b];

// PART 1
const segmentsByDigit = [
    'abcefg',   // 0
    'cf',       // 1
    'acdeg',    // 2
    'acdfg',    // 3
    'bcdf',     // 4
    'abdfg',    // 5
    'abdefg',   // 6
    'acf',      // 7
    'abcdefg',  // 8
    'abcdfg',   // 9
];

const uniqueDigits = [1, 4, 7, 8];
const uniqueDigitLengths = uniqueDigits.map(digit => segmentsByDigit[digit].length);

const outputDigits = input.map(row => row.split(' | ')[1].split(' '));

const uniqueDigitCount = outputDigits.reduce((count, digits) => (
    count + digits.reduce((lineCount, digit) => (
        lineCount + (uniqueDigitLengths.includes(digit.length) ? 1 : 0)
    ), 0)
), 0);

console.dir(uniqueDigitCount);



// PART 2
const countOccurrences = strArr => (obj, segment) => {
    obj[segment] = strArr.filter(str => str.includes(segment)).length;
    return obj;
};

const allSegments = 'abcdefg'.split('');
const allSegmentOccurrences = allSegments.reduce(countOccurrences(segmentsByDigit), {});

const getOutputDigits = inputLine => {
    const [signalStrs, outputs] = inputLine.split(' | ').map(section => section.split(' '));

    const signals = signalStrs.map(str => str.split(''));
    const signal1 = signals.find(signal => signal.length === 2);
    const signal7 = signals.find(signal => signal.length === 3);
    const signal4 = signals.find(signal => signal.length === 4);

    // let's make a set of possible output segments for each input segment to fill as we go
    const possibleSegmentMap = {};

    // first we can find the mapping for segments in digit 1
    for (let segment of segmentsByDigit[1]) {
        possibleSegmentMap[segment] = [...signal1];
    }

    // then we'll do 7
    for (let segment of segmentsByDigit[7]) {
        if (!segmentsByDigit[1].includes(segment)) {
            possibleSegmentMap[segment] = difference(signal7, new Set(signal1));
        }
    }

    // next is 4
    for (let segment of segmentsByDigit[4]) {
        if (!segmentsByDigit[1].includes(segment)) {
            possibleSegmentMap[segment] = difference(signal4, new Set(signal1));
        }
    }

    // and the rest
    const segmentsSoFar = new Set(Object.values(possibleSegmentMap).reduce(
        (segments, segmentSet) => union(segments, segmentSet), []));
    const remainingSegments = difference(allSegments, segmentsSoFar);

    for (let segment of allSegments) {
        if (!possibleSegmentMap[segment]) {
            possibleSegmentMap[segment] = [...remainingSegments];
        }
    }

    // now we need to narrow down the segments with multiple possible outputs; do this by looking at occurrences
    const finalSegmentMap = {};
    for (let [inputSegment, segmentMap] of Object.entries(possibleSegmentMap)) {
        if (segmentMap.length > 1) {
            const inputCount = allSegmentOccurrences[inputSegment];
            const outputCounts = segmentMap.reduce(countOccurrences(signalStrs), {});
            finalSegmentMap[inputSegment] = Object.entries(outputCounts).find(([, count]) => inputCount === count)[0];
        } else {
            finalSegmentMap[inputSegment] = possibleSegmentMap[inputSegment][0];
        }
    }

    // oops, I need to flip the inputs and outputs... that's what I get for naming it "final"
    const reallyFinalSegmentMap = Object.entries(finalSegmentMap).reduce(
        (acc, [inputSeg, outputSeg]) => {
            acc[outputSeg] = inputSeg;
            return acc
        }, {});

    // whew! now let's go back to those outputs
    return +outputs.map(
        output => output.split('')
                        .map(seg => reallyFinalSegmentMap[seg])
                        .sort()
                        .join('')
    ).map(digit => segmentsByDigit.indexOf(digit))
     .join('');
}

const sumOverLines = input.reduce((sum, line) => sum + getOutputDigits(line), 0);

console.log(sumOverLines);
