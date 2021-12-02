const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const boardingPasses = loadInput({ test });

// START CODE FOR DAY'S PUZZLES HERE
const getSeatId = (boardingPass) => {
    const rowRegEx = /(B|F)+/;
    const colRegEx = /(L|R)+/;
    const row = parseInt(rowRegEx.exec(boardingPass)[0].replace(/F/g,'0').replace(/B/g,'1'), 2);
    const col = parseInt(colRegEx.exec(boardingPass)[0].replace(/L/g,'0').replace(/R/g,'1'), 2);

    return row * 8 + col;
}

// part 1
const maxSeatId = boardingPasses.reduce((max, pass) => Math.max(max, getSeatId(pass)), 0);

console.log(maxSeatId);


// part 2
const seatIds = boardingPasses.map(pass => getSeatId(pass));
seatIds.sort((a, b) => a - b);

const seatAboveMine = seatIds.find((seatId, ind) => (ind > 0 && (seatId - seatIds[ind-1] === 2)));

console.log(seatAboveMine - 1);
