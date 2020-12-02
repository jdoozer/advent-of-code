const fs = require('fs');
const path = require('path');

const loadInput = ({ day, test=false }) => {
  const file = path.resolve(`day${day}/${test ? 'test_' : ''}input.txt`);

  const input = fs.readFileSync(file, 'utf8');
  return input.trim().split('\n').map(num => parseInt(num));
}

module.exports = loadInput;