const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

// helpers for both parts

// PART 1
const nodes = input.map((row, y) => row.split('').map((valueStr, x) => ({
    x,
    y,
    value: parseInt(valueStr),
    distance: (x === 0 && y === 0) ? 0 : Infinity,
    visited: (x === 0 && y === 0),
})));
const yMax = nodes.length - 1;
const xMax = nodes[0].length - 1;

// console.dir({ xMax, yMax, nodes})

let currNode = nodes[0][0];
let { x, y, distance } = currNode;

while (x !== xMax || y !== yMax) {
    const neighbors = [];
    if (x !== 0) neighbors.push({ x: x - 1, y });
    if (x !== xMax) neighbors.push({ x: x + 1, y });
    if (y !== 0) neighbors.push({ x, y: y - 1 });
    if (y !== yMax) neighbors.push({ x, y: y + 1 });

    console.dir({neighbors})
    let minDistanceNode = { distance: Infinity };
    for (const neighbor of neighbors) {
        // console.log(neighbor)
        const neighborNode = nodes[neighbor.y][neighbor.x];
        // console.dir({ neighbor, neighborNode, minDistanceNode })
        if (neighborNode.visited) continue;
        
        neighborNode.distance = Math.min(neighborNode.distance, distance + neighborNode.value);
        if (neighborNode.distance < minDistanceNode.distance) {
            minDistanceNode = neighborNode;
        }
    }
    // console.log(minDistanceNode)
    currNode.visited = true;
    currNode = minDistanceNode;
    ({ x, y, distance } = currNode);
    console.dir({currNode})

}

console.log(distance)

// console.log(nodes)
// PART 2
