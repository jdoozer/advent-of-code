const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
let testInput;

const input = (test && testInput) ? testInput : loadInput({ test });

// helper functions
function truncate(num) {
  return Math.sign(num) * Math.floor(Math.abs(num));
}

function runProgram(program, modelNumber) {  
  const initialState = { w: 0, x: 0, y: 0, z: 0 };
  const stateKeys = Object.keys(initialState);

  let inputCount = 0;

  function doOperation(command, state) {
    const { op, arg1, arg2 } = command;
  
    if (op === 'inp') {
      if (inputCount > modelNumber.length - 1) throw new Error('ran out of inputs!');
      const newState = { ...state, [arg1]: parseInt(modelNumber[inputCount]) };
      inputCount++;
      return newState;
    }
  
    const value2 = stateKeys.includes(arg2) ? state[arg2] : parseInt(arg2);
  
    switch (op) {
      case 'add':
        return { ...state, [arg1]: state[arg1] + value2 };
      case 'mul':
        return { ...state, [arg1]: state[arg1] * value2 };
      case 'div':
        if (value2 === 0) throw new Error('cannot divide by zero!');
        return { ...state, [arg1]: truncate(state[arg1] / value2) };
      case 'mod':
        if (value2 === 0) throw new Error('cannot take modulus of zero!');
        return { ...state, [arg1]: state[arg1] % value2 };
      case 'eql':
        return { ...state, [arg1]: state[arg1] === value2 ? 1 : 0 };
      default:
        return state;
    }
  }

  let state = initialState;
  console.dir({initialState});
  for (const command of program) {
    state = doOperation(command, state);
    console.dir({command, state}, {depth: null});
  }

  return state;
}

function compileProgram(program) {  
  const initialState = { w: 0, x: 0, y: 0, z: 0 };
  const stateKeys = Object.keys(initialState);

  let inputCount = 0;

  function isZero(numOrStr) {
    return numOrStr.toString() === '0';
  }

  function isOne(numOrStr) {
    return numOrStr.toString() === '1';
  }

  function isInput(numOrStr) {
    return numOrStr.toString().startsWith('n');
  }

  function compileOperation(command, state) {
    const { op, arg1, arg2 } = command;
  
    if (op === 'inp') {
      return { ...state, [arg1]: `n${inputCount}` };
    }
  
    const newState = { ...state };
    
    const v1 = state[arg1];
    const v2 = stateKeys.includes(arg2) ? state[arg2] : parseInt(arg2);

    newState[arg1] = getNewValue(op, v1, v2);
    
    // console.dir({ command, state, newVal: newState[arg1] }, { depth: null })

    function getNewValue(op, v1, v2) {
      switch (op) {
        case 'add':
          if (isZero(v1)) return v2;
          if (isZero(v2)) return v1;
          return (isNaN(v1) || isNaN(v2)) ? `(${v1} + ${v2})` : (v1 + v2);
        case 'mul':
          if (isZero(v1) || isZero(v2)) return 0;
          if (isOne(v1)) return v2;
          if (isOne(v2)) return v1;
          return (isNaN(v1) || isNaN(v2)) ? `(${v1} * ${v2})` : (v1 * v2);
        case 'div':
          if (isZero(v2)) throw new Error('cannot divide by zero!');
          if (isZero(v1)) return 0;
          if (v1 === v2) return 1;
          if (isOne(v2)) return v1;
          return (isNaN(v1) || isNaN(v2)) ? `(${v1} / ${v2})` : truncate(v1 * v2);
        case 'mod':
          if (isZero(v2)) throw new Error('cannot take modulus of zero!');
          if (isZero(v1) || (v1 === v2)) return 0;
          return (isNaN(v1) || isNaN(v2)) ? `(${v1} % ${v2})` : v1 % v2;
        case 'eql':
          if (v1 === v2) return 1;
          if (isInput(v1) && !isNaN(v2) && (v2 < 1 || v2 > 9)) return 0;
          if (isInput(v2) && !isNaN(v1) && (v1 < 1 || v1 > 9)) return 0;
          return (isNaN(v1) || isNaN(v2)) ? `(${v1} === ${v2})` : 0;
        }
    }

    return newState;
  }

  let state = initialState;
  let runs = 0;
  for (const command of program) {
    runs++;
    if (runs > 40) break;
    state = compileOperation(command, state);
    console.log(state)
  }

  return state;
}

// PART 1
const program = input.map(row => {
  const [op, arg1, arg2] = row.split(' ');
  return { op, arg1, arg2 };
});

// const modelNumber = '99999999999999';
// const modelNumber = '88888888888888';
// const modelNumber = '12345678912345';
// const modelNumber =    '99998979898399';
const modelNumber =       '95299897999897';
// 5 matters
// 8 


/// Notes
// w = n4
// x = 1
// y = n4 + 8
// z = (((n1 + 7) * 26 + n2 + 8) * 26 + n3 * 16) * 26 + n4 + 8

// z = ((16 * 26 + 17) * 26 + 16) * 26 + 9
// z = (433 * 26 + 16) * 26 + 9
// z = 11274 * 26 + 9

// z = (433 * 26 + 26) * 26 + 9



console.dir({ modelNumber, ...runProgram(program, modelNumber)});

// compileProgram(program);

// PART 2

let i = 0;
let res = [];
for (const commandRow of input) {
  if (commandRow.startsWith('inp')) {
    i = 0;
  } else {
    i++;
  }
  if (res[i]) {
    res[i] = `${res[i]}${commandRow.padEnd(10)}`;
  } else {
    res[i] = commandRow.padEnd(11);
  }
}
console.log(res);