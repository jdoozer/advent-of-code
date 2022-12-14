const printMatrix = (matrix, opts) => {
    const { delimiter = ' ' } = opts || {};
    matrix.forEach(row => console.log(row.join(delimiter)));
}

module.exports = printMatrix;