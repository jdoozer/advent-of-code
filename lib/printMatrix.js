const printMatrix = (matrix, opts) => {
    const { delimiter, makeEven } = opts || { delimiter: ' ', makeEven: false };
    matrix.forEach(row => console.log(row.join(delimiter)));
}

module.exports = printMatrix;