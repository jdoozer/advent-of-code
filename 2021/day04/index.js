const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test, delimiter: '\n\n' });

// PART 1
const numbers = input[0].split(',');
const boards = input.slice(1).map(boardStr => (
    boardStr.split('\n')
            .map(str => str.trim()
                           .split(/\s+/)
                           .map(num => ({ value: num, called: false })))
));

const call = (board, number) => {
    const calledSquare = board.flat().find(square => square.value === number);
    if (calledSquare) {
        calledSquare.called = true;
    }
}

const callOnBoards = (boards, number) => boards.forEach(board => call(board, number));

const isWinningSet = (set) => set.every(square => square.called);

const isWinningBoard = (board) => {
    // first check rows
    if (board.some(row => isWinningSet(row))) {
        return true;
    }
    // then columns
    for (let i = 0; i < board[0].length; i++) {
        if (isWinningSet(board.map(row => row[i]))) {
            return true;
        }
    }
    return false;
}

const findWinningBoard = (boards) => boards.find(board => isWinningBoard(board));

const getScore = (board, number) => {
    const boardUncalledSum = board.flat().reduce((score, { value, called }) => (
        score + (called ? 0 : parseInt(value))
    ), 0);
    return number * boardUncalledSum;
};

let winningBoard = null;
let i = 0;
while (i < numbers.length) {
    callOnBoards(boards, numbers[i]);
    winningBoard = findWinningBoard(boards);
    if (winningBoard) {
        break;
    }
    i++;
}

console.log(getScore(winningBoard, numbers[i]));


// PART 2
const findLosingBoardIndex = (boards) => boards.findIndex(board => !isWinningBoard(board));

let losingBoardIndex = -1;
i = 0;
while (i < numbers.length) {
    callOnBoards(boards, numbers[i]);
    losingBoardIndex = findLosingBoardIndex(boards);
    if (findLosingBoardIndex(boards.slice(losingBoardIndex + 1)) < 0) {
        break;
    }
    i++;
}

// now we have the last board to win, let's keep playing until it wins
const lastBoardStanding = boards[losingBoardIndex];
while (i < numbers.length) {
    call(lastBoardStanding, numbers[i]);
    if (isWinningBoard(lastBoardStanding)) {
        break;
    }
    i++;
}

console.log(getScore(lastBoardStanding, numbers[i]));
