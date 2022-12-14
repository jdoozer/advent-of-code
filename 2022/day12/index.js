const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

let start1;
let start2;
const end1 = [];
const end2 = [];
const elevations = [];
const distancesFromStart1 = {};
const distancesFromStart2 = {};
const graph1 = {};
const graph2 = {};

// initialize all the things
input.forEach((row, i) => {
    elevations.push([]);
    row.split('').forEach((char, j) => {
        const posAsStr = [i, j].toString();

        distancesFromStart1[posAsStr] = Infinity;
        graph1[posAsStr] = [];
        distancesFromStart2[posAsStr] = Infinity;
        graph2[posAsStr] = [];

        let currElevation = char.charCodeAt();
        if (char === 'S') {
            start1 = posAsStr;
            end2.push(posAsStr);
            distancesFromStart1[posAsStr] = 0;
            currElevation = 'a'.charCodeAt();
        } else if (char === 'E') {
            end1.push(posAsStr);
            start2 = posAsStr;
            distancesFromStart2[posAsStr] = 0;
            currElevation = 'z'.charCodeAt();
        } else if (char === 'a') {
            end2.push(posAsStr);
        }
        elevations[i].push(currElevation);

        // add paths where possible (look at top and left)
        // TODO: initialize graph2 here!!!
        if (i !== 0) {
            const step = elevations[i-1][j] - currElevation;
            if (step <= 1) {
                graph1[posAsStr].push([i-1, j].toString());
                graph2[[i-1, j].toString()].push(posAsStr);
            }
            if (step >= -1) {
                graph1[[i-1, j].toString()].push(posAsStr);
                graph2[posAsStr].push([i-1, j].toString());
            }
        }
        if (j !== 0) {
            const step = elevations[i][j-1] - currElevation;
            if (step <= 1) {
                graph1[posAsStr].push([i, j-1].toString());
                graph2[[i, j-1].toString()].push(posAsStr);
            }
            if (step >= -1) {
                graph1[[i, j-1].toString()].push(posAsStr);
                graph2[posAsStr].push([i, j-1].toString());
            }
        }
    })
});

const breadthFirstSearch = (graph, distancesFromStart, start, end) => {
    // initialize nodeQueue of vertices to be scanned
    let nodeQueue = [start];

    // stores vertices that have been reached at least once in BFS
    let visited = new Set(start);

    let foundEnd = null;

    // BFS algorithm
	while (nodeQueue.length && !foundEnd) {
        const nodeToScan = nodeQueue.shift();
        graph[nodeToScan].forEach((next) => {
            if (visited.has(next)) {
                return;
            }
            visited.add(next);
            distancesFromStart[next] = distancesFromStart[nodeToScan] + 1;
            nodeQueue.push(next);

            if (end.includes(next)) foundEnd = next;
        });
    }
    return foundEnd;
};

// PART 1
const endNode1 = breadthFirstSearch(graph1, distancesFromStart1, start1, end1);
console.log(distancesFromStart1[endNode1]);

// PART 2
const endNode2 = breadthFirstSearch(graph2, distancesFromStart2, start2, end2);
console.log(distancesFromStart2[endNode2]);
