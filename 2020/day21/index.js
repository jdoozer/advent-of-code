const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const ingredientLists = loadInput({ test });

// START CODE FOR DAY'S PUZZLES HERE
const ingredientRegEx = /((\w+\b)(?=[\s\S]*\())/g;
const allergenRegEx = /((\w+\b)(?<=\(contains [\s\S]*))/g;

const ingredientsByAllergen = {};
ingredientLists.forEach(ingredientList => {
    const ingredients = ingredientList.match(ingredientRegEx);
    const allergens = ingredientList.match(allergenRegEx);
    allergens.forEach(allergen => {
        if (ingredientsByAllergen[allergen]) {
            ingredientsByAllergen[allergen].push(new Set([...ingredients]))
            // ingredients.forEach(ingredient => ingredientsByAllergen[allergen].add(ingredient));
        } else {
            ingredientsByAllergen[allergen] = [new Set([...ingredients])];
            // ingredientsByAllergen[allergen] = new Set([...ingredients]);
        }
    });
});

console.log(ingredientsByAllergen)

// const sorted = Object.entries(allergensByIngredient).sort((a, b) => a[1].size - b[1].size);

// console.log(sorted)

// TEST ANSWER
// count appearances of ingredients: kfcds, nhms, sbzzf, trh