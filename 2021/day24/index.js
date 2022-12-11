const loadInput = require('../../lib/loadInput');

const input = loadInput({});

// constants and helper functions
const MODEL_NUMBER_LENGTH = 14;
const COMMANDS_PER_NUMBER = input.length / MODEL_NUMBER_LENGTH;

function getCriticalInputs(program) {
  return {
    divideZ: parseInt(program[4].split(' ')[2]),
    firstAdd: parseInt(program[5].split(' ')[2]),
    secondAdd: parseInt(program[15].split(' ')[2]),
  };
}

function getConstant(zs, index, currConstant) {
  return zs.reduce((constant, zCurr, i) => {
    if (i >= index) return constant;
    return constant + zCurr.baseConst * (26 ** (index - i));
  }, currConstant);
}

function getVectorExponents(base, digit) {
  return base.map((x, i) => {
    if (i === digit) {
      return 0;
    };
    return (typeof x === 'undefined') ? undefined : x + 1;
  });
}

// PART 1
let zCalcs = [];
let conditions = [];
for (let i = 0; i < MODEL_NUMBER_LENGTH; i++) {
 
  const currentProgram = input.slice(i * COMMANDS_PER_NUMBER, (i + 1) * COMMANDS_PER_NUMBER);
  const { divideZ, firstAdd, secondAdd } = getCriticalInputs(currentProgram);

  const iAdjusted = divideZ === 1 ? i : i-1;

  if (i === 0) {
    zCalcs[i] = {
      i,
      string: `n${i+1} + ${secondAdd}`,
      vectorExponents: [0, ...Array(MODEL_NUMBER_LENGTH-1).fill(undefined)],
      const: secondAdd,
      baseConst: secondAdd,
    }
    continue;
  }

  const conditionCheck = zCalcs[i-1].baseConst + firstAdd;

  if (conditionCheck > 9) {
    zCalcs[i] = {
      i,
      string: `(${zCalcs[iAdjusted - 1].string}) * 26 + n${i+1} + ${secondAdd}`,
      vectorExponents: getVectorExponents(zCalcs[iAdjusted - 1].vectorExponents, i),
      const: getConstant(zCalcs, iAdjusted, secondAdd),
      baseConst: secondAdd,
    };
  } else {
    zCalcs[i] = {
      ...zCalcs[iAdjusted - 1],
      i,
      baseConst: secondAdd,
    };
    let conditionStr = '';
    if (conditionCheck > 0) conditionStr = ` + ${conditionCheck}`;
    if (conditionCheck < 0) conditionStr = ` - ${Math.abs(conditionCheck)}`;
    conditions.push(`n${i} = n${i-1}${conditionStr}`)
  }

}

console.dir({zCalcs, conditions}, { depth: null })

// PART 1
const program = input.map(row => {
  const [op, arg1, arg2] = row.split(' ');
  return { op, arg1, arg2 };
});

// const modelNumber = '99999999999999';
// const modelNumber = '88888888888888';
// const modelNumber = '12345678901234';
const modelNumber =    '99998979898399';
