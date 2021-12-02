const loadInput = require('../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const deckStrings = loadInput({ test, delimiter: '\n\n' });

// START CODE FOR DAY'S PUZZLES HERE
// const decks = deckStrings.map(deckString => deckString.split('\n').slice(1).map(numStr => parseInt(numStr, 10)));
const makeDeck = (deckString) => deckString.split('\n').slice(1).map(numStr => parseInt(numStr, 10));
const startDecks = { player1: makeDeck(deckStrings[0]), player2: makeDeck(deckStrings[1]) };

// PART 1
const playGame1 = decks => {
    const decksCopy = {
        player1: [...decks.player1],
        player2: [...decks.player2],
    };
    while (decksCopy.player1.length && decksCopy.player2.length) {
        const card1 = decksCopy.player1.shift();
        const card2 = decksCopy.player2.shift();
        if (card1 > card2) {
            decksCopy.player1.push(card1);
            decksCopy.player1.push(card2);
        } else {
            decksCopy.player2.push(card2);
            decksCopy.player2.push(card1);
        }
    }
    return decksCopy;
};

const calcScore = decks => Object.values(decks).find(deck => deck.length)
    .reduce((score, card, ind, arr) => score + card * (arr.length - ind), 0);

const gameDecks1 = playGame1(startDecks);
console.log(calcScore(gameDecks1));


// PART 2
function eqSet(as, bs) {
    if (as.size !== bs.size) return false;
    for (var a of as) if (!bs.has(a)) return false;
    return true;
}


const playGame2 = decks => {
    const decksCopy = {
        player1: [...decks.player1],
        player2: [...decks.player2],
    };
    const startCards = [];

    const playRound = decks => {
        const player1Cards = new Set(decks.player1);
        const player2Cards = new Set(decks.player2);
        // console.log(startCards)
        if (startCards.some(([prev1, prev2]) => eqSet(player1Cards, prev1) && eqSet(player2Cards, prev2))) {
            console.log('avoiding infinite loop');
            return true;
        }
        startCards.push([player1Cards, player2Cards]);

        const card1 = decks.player1.shift();
        const card2 = decks.player2.shift();
        console.log(`CARDS PLAYED: ${card1}, ${card2}`);

        if (decks.player1.length >= card1 && decks.player2.length >= card2) {
            console.log('starting recursive subgame')
            return playRound(
                { player1: decks.player1.slice(0, card1), player2: decks.player2.slice(0, card2) }
            );
        }

        return (card1 > card2);
    }


    while (decksCopy.player1.length && decksCopy.player2.length) {
        const player1win = playRound(decksCopy);
        if (player1win) {
            decksCopy.player1.push(card1);
            decksCopy.player1.push(card2);
        } else {
            decksCopy.player2.push(card2);
            decksCopy.player2.push(card1);
        }


        console.log(decksCopy)
    }
    return decks;
};

console.log(startDecks);
const gameDecks2 = playGame2(startDecks);
// console.log(gameDecks2);
console.log(calcScore(gameDecks2));
