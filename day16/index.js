const loadInput = require('../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
let [ranges, myTicket, nearbyTix] = loadInput({ test, delimiter: '\n\n' });

// START CODE FOR DAY'S PUZZLES HERE
const fieldRangesRegEx = /([\w ]+): (\d+)-(\d+) or (\d+)-(\d+)/;

let fieldRanges = {};
const validRanges = ranges.split('\n').reduce((rangeArray, rangeStr, i) => {
    const [ , field, min1Str, max1Str, min2Str, max2Str] = rangeStr.match(fieldRangesRegEx);
    const [min1, max1, min2, max2] = [min1Str, max1Str, min2Str, max2Str].map(str => parseInt(str, 10));
    rangeArray.push({ min: min1, max: max1 });
    rangeArray.push({ min: min2, max: max2 });
    fieldRanges[field] = { min1, max1, min2, max2 };
    return rangeArray;
}, []);

validRanges.sort((range1, range2) => range1.min - range2.min);

let combinedRange = null;
const validRangesReduced = validRanges.reduce((reducedRanges, currRange, i) => {
    const compRange = combinedRange || currRange;

    if (i === validRanges.length - 1) {
        reducedRanges.push(compRange);
    } else {
        if (compRange.max + 1 < validRanges[i+1].min) {
            reducedRanges.push(compRange);
            combinedRange = null;
        }
        else combinedRange = { min: compRange.min, max: validRanges[i+1].max };    
    }
    return reducedRanges;
}, []);

// console.log(fieldRanges)
// console.log(validRanges)
// console.log(validRangesReduced)

const parseTicket = (ticketStr) => ticketStr.split(',').map(value => parseInt(value, 10));

const nearbyTickets = nearbyTix.split('\n').slice(1).map(parseTicket);

const isValidNumber = (num) => validRangesReduced.some(({ min, max }) => num >= min && num <= max);


// part 1
const findInvalidSum = (ticket) => ticket.reduce((sum, value) => sum + (isValidNumber(value) ? 0 : value), 0);

const invalidSum = nearbyTickets.reduce((sum, ticket) => sum + findInvalidSum(ticket), 0);

console.log(invalidSum);

// part 2
const isValidTicket = (ticket) => ticket.every(isValidNumber);

const validTickets = nearbyTickets.filter(isValidTicket);

const allFields = Object.keys(fieldRanges);

// initialize array of sets of potentially valid fields for each position in the ticket
const allPossibleFields = validTickets[0].map((_, index) => ({ fields: new Set(allFields), index }));

const validFieldsWithIndex = validTickets.reduce((fieldsWithIndex, ticket) => {
    ticket.forEach((value, pos) => {
        fieldsWithIndex[pos].fields.forEach((field) => {
            const { min1, max1, min2, max2 } = fieldRanges[field];
            if (value < min1 || value > max2 || (value > max1 && value < min2)) {
                fieldsWithIndex[pos].fields.delete(field);
            }
        });
    });
    return fieldsWithIndex;
}, allPossibleFields);

validFieldsWithIndex.sort((a, b) => a.fields.size - b.fields.size);

validFieldsWithIndex.forEach(({ fields: currFields }, i) => {
    if (currFields.size === 1) {
        const currField = currFields.values().next().value;
        validFieldsWithIndex.slice(i + 1).forEach(({ fields }) => fields.delete(currField));
    }
});

const myTicketParsed = parseTicket(myTicket.split('\n')[1]);

const ans = validFieldsWithIndex.reduce((departureProduct, { fields, index }) => {
    const field = fields.values().next().value;
    return departureProduct * ((field.startsWith('departure')) ? myTicketParsed[index] : 1);
}, 1);

console.log(ans);
