const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

// The winner of the whole tournament is the player with the highest score.
// Your total score is the sum of your scores for each round.
// The score for a single round is the score for the shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors)
// plus the score for the outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won).
// 
// first column: A for Rock, B for Paper, and C for Scissors
// second column: X for Rock, Y for Paper, and Z for Scissors.

const shapeScores = { rock: 1, paper: 2, scissors: 3 };

// PART 1
const wins = ['A Y', 'B Z', 'C X'];
const draws = ['A X', 'B Y', 'C Z'];
const myShapeMap = { X: 'rock', Y: 'paper', Z: 'scissors' };

const totalScore = input.reduce((score, row) => {
    let roundScore = 0;
    if (wins.includes(row)) roundScore += 6;
    if (draws.includes(row)) roundScore += 3;

    const shape = row[2];
    return score + roundScore + shapeScores[myShapeMap[shape]];
}, 0);
console.log(totalScore);

// PART 2
// X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win
const resultScores = { X: 0, Y: 3, Z: 6 };
const playsByShapeScore = { rock: ['A Y', 'B X', 'C Z'], paper: ['A Z', 'B Y', 'C X'], scissors: ['A X', 'B Z', 'C Y'] };

const totalScore2 = input.reduce((score, row) => {
    let roundScore = 0;
    for (const [shape, plays] of Object.entries(playsByShapeScore)) {
        if (plays.includes(row)) {
            roundScore += shapeScores[shape]
            break;
        }
    }
    const result = row[2];
    return score + roundScore + resultScores[result];
}, 0);

console.log(totalScore2);