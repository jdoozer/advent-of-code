const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

const valvesById = {};
const zeroFlowValves = new Set();

input.forEach((row) => {
    const match = row.match(/Valve (\w\w) has flow rate=(\d+); tunnels? leads? to valves? (\w\w(?:, \w\w)*)/);
    const [id, flowStr, connectedStr] = match.slice(1);

    valvesById[id] = {
        id,
        flow: +flowStr,
        connected: connectedStr.split(', '),
        isOpen: false,
    };

    if (flowStr === '0') zeroFlowValves.add(id);
});

const valveIds = Object.keys(valvesById);
const n = valveIds.length;
const distances = new Array(n).fill().map(_ => new Array(n));

for (let u = 0; u < n; u++) {
    const connectedToU = valvesById[valveIds[u]].connected;
    for (let v = 0; v < n; v++) {
        if (u === v) distances[u][v] = 0;
        else {
            distances[u][v] = connectedToU.includes(valveIds[v]) ? 1 : Infinity;
        }
    }
}

for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (distances[i][j] > distances[i][k] + distances[k][j]) {
                distances[i][j] = distances[i][k] + distances[k][j];
            }
        }
    }
}

Object.entries(valvesById).map(([id, valve], ind1) => {
    valvesById[id] = {
        ...valve,
        distances: distances[ind1].flatMap((dist, ind2) => {
            const valveIdToCheck = valveIds[ind2];
            return ind1 === ind2 || zeroFlowValves.has(valveIdToCheck) ? [] : { id: [valveIds[ind2]], dist };
        }),
    };
});

console.dir(valvesById, { depth: null })

// let maxFlow = 0;
// let remainingSteps = 30;
// let currId = 'AA';
// let currFlow = 0;
// while (remainingSteps > 0) {
//     const { distances, flow } = valvesById[currId];
//     currFlow += flow * remainingSteps;
//     distances.forEach(({ id, dist }) => {
//         if (dist < remainingSteps) {
//             currId = id;
//             remainingSteps -= dist + 1; // assume we take a step to open the valve
//         }
//     })
// }

// WORK IN PROGRESS......
// function getAllFlows(currId, flows, remainingSteps, visited = []) {
//     if (remainingSteps <= 0) {
//         return flows;
//     }
//     const { distances, flow } = valvesById[currId];
//     const nextFlow = flow * remainingSteps;
//     for (const { id, dist } of distances) {
//         if (dist >= remainingSteps || visited.includes(id)) break;
//         flows.forEach(curr => curr + nextFlow + )
//     }
// }

// const allFlows = getAllFlows('AA', [0], 30, ['AA']);
