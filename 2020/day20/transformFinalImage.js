const loadInput = require('../../lib/loadInput');

const filename = process.argv[2];

let img = loadInput({ filename }).filter(row => row).map(row => row.split(' ').join(''));
let ids = [
    [1951, 2311, 3079],
    [2729, 1427, 2473],
    [2971, 1489, 1171],
];

const rotate90cwArr = matrix => matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
const rotate90cw = stringArray => {
    const matrix = stringArray.map(str => str.split(''));
    const rotatedMatrix = rotate90cwArr(matrix);
    return rotatedMatrix.map(arr => arr.join(''));
}

ids = ids.reverse();
ids = rotate90cwArr(rotate90cwArr(rotate90cwArr(ids)));
console.log(ids)

// console.log(img)
img = img.reverse();
img = rotate90cw(rotate90cw(rotate90cw(img)));
console.log(img)

