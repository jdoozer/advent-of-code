const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
let testInput;

// testInput = [
//   'on x=10..12,y=10..12,z=10..12',
//   'on x=11..13,y=11..13,z=11..13',
//   'off x=9..11,y=9..11,z=9..11',
//   'on x=10..10,y=10..10,z=10..10',
// ];

const input = (test && testInput) ? testInput : loadInput({ test });

// helper functions
const rowRegex = /(on|off) x=([-\d]*)..([-\d]*),y=([-\d]*)..([-\d]*),z=([-\d]*)..([-\d]*)/;

const DIMENSIONS = ['x', 'y', 'z'];

const instructions = input.map(inputRow => {
  const [, ...matches] = inputRow.match(rowRegex);
  const [target, xMin, xMax, yMin, yMax, zMin, zMax] = matches;
  return {
    target: target === 'on',
    limits: {
      x: [parseInt(xMin, 10), parseInt(xMax, 10)],
      y: [parseInt(yMin, 10), parseInt(yMax, 10)],
      z: [parseInt(zMin, 10), parseInt(zMax, 10)],
    },
  };
});

function outOfBounds(limits, boundary) {
  return limits.every(limit => limit > boundary) || limits.every(limit => limit < -1 * boundary)
}

function isOverlapping(block1, block2) {
  function isOverlappingDimension(limits1, limits2) {
    return !(limits1[0] > limits2[1] || limits1[1] < limits2[0]);
  }  
  return DIMENSIONS.every(dim => isOverlappingDimension(block1[dim], block2[dim]));
}

function remove(startBlock, overlapBlock) {
  const getOverlapType = (blockLimits, overlapLimits) => {
    if (overlapLimits[0] <= blockLimits[0]) {
      return overlapLimits[1] >= blockLimits[1] ? 'outside' : 'start';
    }
    return overlapLimits[1] >= blockLimits[1] ? 'end' : 'inside';
  }

  // figure out what kind of overlap we have in each dimension (inside, outside, start, end)
  // then we need to slice our block based on overlap types
  let blocksToSlice = [startBlock];
  let finalBlocks = [];

  for (const dim of DIMENSIONS) {
    let nextBlocksToSlice = [];

    for (const block of blocksToSlice) {
      const overlapType = getOverlapType(block[dim], overlapBlock[dim]);
      switch (overlapType) {
        case 'outside':
          nextBlocksToSlice.push(block);
          break;
        case 'inside':
          nextBlocksToSlice.push({ ...block, [dim]: overlapBlock[dim] });
          finalBlocks.push({ ...block, [dim]: [block[dim][0], overlapBlock[dim][0] - 1] });
          finalBlocks.push({ ...block, [dim]: [overlapBlock[dim][1] + 1, block[dim][1]] });
          break;
        case 'start':
          nextBlocksToSlice.push({ ...block, [dim]: [block[dim][0], overlapBlock[dim][1]] });
          finalBlocks.push({ ...block, [dim]: [overlapBlock[dim][1] + 1, block[dim][1]] });
          break;
        case 'end':
          finalBlocks.push({ ...block, [dim]: [block[dim][0], overlapBlock[dim][0] - 1] });
          nextBlocksToSlice.push({ ...block, [dim]: [overlapBlock[dim][0], block[dim][1]] });
          break;
      }
    }
    blocksToSlice = nextBlocksToSlice;
  };
  return [...blocksToSlice, ...finalBlocks].filter(block => !isOverlapping(block, overlapBlock));
}

function handleInstruction(inputState, instruction, boundary) {
  // input state is an array of blocks with state "on"
  // where each entry has the shape: { x: [xMin, xMax], y: [yMin, yMax], z: [zMin, zMax] }
  // (same as instruction.limits)

  const { target, limits } = instruction;

  // if instruction is fully out of bounds, do nothing
  if (DIMENSIONS.some(dim => outOfBounds(limits[dim], boundary))) {
    return inputState;
  }

  // cap instruction limits to ensure within bounds
  const boundedLimits = Object.entries(limits).reduce((bounded, [dim, lims]) => {
    bounded[dim] = [Math.max(lims[0], -1 * boundary), Math.min(lims[1], boundary)];
    return bounded;
  }, {});

  let state = [];
  for (const block of inputState) {
    // if block and instruction overlap, we should slice up block before putting into new state
    // so we only account for sub-blocks that are not in instruction limits
    if (isOverlapping(block, boundedLimits)) {
      const blocksToAdd = remove(block, boundedLimits);
      state = state.concat(blocksToAdd);
    } else {
      state.push(block);
    }
  }
  if (target) {
    state.push(boundedLimits);
  }
  return state;
}

function getNumCubesOn(state) {
  return state.reduce((sum, region) => {
    const numCubesInRegion = Object.values(region).reduce((prod, limits) => prod * (limits[1] - limits[0] + 1), 1);
    return sum + numCubesInRegion;
  }, 0);
}


// PART 1
let state = [];

for (const instruction of instructions) {
  state = handleInstruction(state, instruction, 50);
}

console.log(getNumCubesOn(state));

// PART 2
state = [];

for (const instruction of instructions) {
  state = handleInstruction(state, instruction, Infinity);
}

console.log(getNumCubesOn(state));
