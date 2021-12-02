const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const input = loadInput({ test });

// part 1
const timestamp = parseInt(input[0], 10);
const buses = input[1].split(',')
    .filter(bus => bus !== 'x')
    .map(bus => parseInt(bus, 10));


const getWaitTime = (bus) => bus - timestamp % bus;

const waitTimes = buses.map(bus => getWaitTime(bus));
const shortestWaitTime = Math.min(...waitTimes);

const shortestWaitTimeBus = buses[waitTimes.indexOf(shortestWaitTime)];

console.log(shortestWaitTime * shortestWaitTimeBus);


// part 2
const busesWithOffsets = input[1].split(',')
    .map((bus, offset) => (bus === 'x' ? null : { bus: parseInt(bus, 10), offset }))
    .filter(bus => bus);

// want to find timestamp t such that (t + offset) % bus = 0 for all bus/offset pairs
// try to go through one pair at a time
const gcd = (x0, y0) => {
    let x = x0;
    let y = y0
    while (y) {
        const t = y;
        y = x % y;
        x = t;
    }
    return x;
}
const lcm = (x, y) => (!x || !y) ? 0 : (x * y) / gcd(x, y);

let tIncrement = busesWithOffsets[0].bus - busesWithOffsets[0].offset;
let t = 0;

busesWithOffsets.forEach(({ bus, offset }, i) => {
    if (!i) return;
    tIncrement = lcm(busesWithOffsets[i-1].bus, tIncrement);
    while ((t + offset) % bus !== 0) {
        t += tIncrement;
    }
});

console.log(t);
