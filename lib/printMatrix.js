const printMatrix = (matrix, opts) => {
    const { delimiter = '', swaps = {} } = opts || {};
    matrix.forEach(row => console.log(row.map(char => swaps[char] || char).join(delimiter)));
}

module.exports = printMatrix;
