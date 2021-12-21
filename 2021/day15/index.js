const loadInput = require('../../lib/loadInput');
// const printMatrix = require('../../lib/printMatrix');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

// helpers for both parts
function findBestPath(inputNodes) {
  const nodes = [...inputNodes.map(row => row.map(node => ({ ...node })))];
  const yMax = nodes.length - 1;
  const xMax = nodes[0].length - 1;

  let currNode = nodes[0][0];
  let nodesToInvestigate = [];
  let { x, y, distance } = currNode;

  while (x !== xMax || y !== yMax) {
    const neighborNodes = [];
    if (x !== 0) neighborNodes.push(nodes[y][x-1]);
    if (x !== xMax) neighborNodes.push(nodes[y][x+1]);
    if (y !== 0) neighborNodes.push(nodes[y-1][x]);
    if (y !== yMax) neighborNodes.push(nodes[y+1][x]);

    // console.dir({ currNode, neighborNodes });

    for (const neighbor of neighborNodes) {
      if (!neighbor.visited) {
        neighbor.distance = Math.min(neighbor.distance, distance + neighbor.value);
        nodesToInvestigate.push(neighbor);
      }
    }
    currNode.visited = true;

    currNode = { distance: Infinity };
    for (const node of nodesToInvestigate) {
      if (!node.visited && node.distance < currNode.distance) {
        currNode = node;
      }
    }

    // now we find the next "currNode"
    nodesToInvestigate = nodesToInvestigate.filter(node => node.x !== currNode.x || node.y !== currNode.y);

    ({ x, y, distance } = currNode);
  }

  return distance;
}


// PART 1
const initialNodes = input.map((row, y) => row.split('').map((valueStr, x) => ({
  x,
  y,
  value: parseInt(valueStr),
  distance: (x === 0 && y === 0) ? 0 : Infinity,
  visited: (x === 0 && y === 0),
})));

// console.log(nodes)
console.log(findBestPath(initialNodes));

// PART 2
function shiftRow(nodeRow, shiftInd) {
  return nodeRow.map(node => (
    { ...node, value: (node.value + shiftInd - 1) % 9 + 1 }
  ));
}

function makeBigRow(nodeRow, repeats, baseShift=0) {
  let bigNodeRow = baseShift > 0 ? shiftRow(nodeRow, baseShift) : nodeRow;
  for (let i = 1; i < repeats; i++) {
    bigNodeRow = bigNodeRow.concat(shiftRow(nodeRow, i + baseShift));
  }
  return bigNodeRow;
}

function makeBigMap(nodes, repeats) {
  let bigMap = nodes.map(nodeRow => makeBigRow(nodeRow, repeats));
  for (let j = 1; j < repeats; j++) {
    bigMap = bigMap.concat(nodes.map(nodeRow => makeBigRow(nodeRow, repeats, j)));
  }
  // need to fix our x and y indices
  return bigMap.map((bigMapRow, y) => bigMapRow.map((bigMapNode, x) => ({ ...bigMapNode, x, y })));
}

const bigNodeMap = makeBigMap(initialNodes, 5);
console.log(findBestPath(bigNodeMap));
