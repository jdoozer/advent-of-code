const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

const valvesById = {};
const zeroFlowValves = new Set();

input.forEach((row) => {
    const match = row.match(/Valve (\w\w) has flow rate=(\d+); tunnels? leads? to valves? (\w\w(?:, \w\w)*)/);
    const [id, flowRateStr, connectedStr] = match.slice(1);

    valvesById[id] = {
        id,
        flowRate: +flowRateStr,
        connected: connectedStr.split(', '),
    };

    if (flowRateStr === '0') zeroFlowValves.add(id);
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
            return ind1 === ind2 || zeroFlowValves.has(valveIdToCheck) ? [] : { id: valveIds[ind2], dist };
        }),
    };
});

const allFlows = [];
function getFlow(currId, currentFlow, remainingSteps, opened = []) {
    const { distances, flowRate } = valvesById[currId];
    const flow = currentFlow + flowRate * remainingSteps;

    if (remainingSteps <= 0 || opened.length === n - zeroFlowValves.size) {
        allFlows.push(flow);
        return;
    }


    for (const { id, dist } of distances) {
        if (opened.includes(id)) continue;
        getFlow(id, flow, remainingSteps - dist - 1, [...opened, id]);
    }
}

getFlow('AA', 0, 30, []);

console.log(Math.max(...allFlows));
