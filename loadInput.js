const fs = require('fs');
const path = require('path');

const loadInput = ({ day, number=true, test=false }) => {
  const file = path.resolve(`day${day}/${test ? 'test_' : ''}input.txt`);

  const input = fs.readFileSync(file, 'utf8');
  const inputStringArray = input.trim().split('\n');
  return number ? inputStringArray.map(num => parseInt(num)) : inputStringArray;
}

module.exports = loadInput;