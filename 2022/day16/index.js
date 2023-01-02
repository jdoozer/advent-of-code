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
const shortestDistances = new Array(n).fill().map(_ => new Array(n));

for (let u = 0; u < n; u++) {
    const connectedToU = valvesById[valveIds[u]].connected;
    for (let v = 0; v < n; v++) {
        if (u === v) shortestDistances[u][v] = 0;
        else {
          shortestDistances[u][v] = connectedToU.includes(valveIds[v]) ? 1 : Infinity;
        }
    }
}

for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (shortestDistances[i][j] > shortestDistances[i][k] + shortestDistances[k][j]) {
              shortestDistances[i][j] = shortestDistances[i][k] + shortestDistances[k][j];
            }
        }
    }
}

Object.entries(valvesById).map(([id, valve], ind1) => {
    valvesById[id] = {
        ...valve,
        valvesToVisit: shortestDistances[ind1].flatMap((dist, ind2) => {
            const valveIdToCheck = valveIds[ind2];
            return ind1 === ind2 || zeroFlowValves.has(valveIdToCheck) ? [] : { id: valveIds[ind2], dist };
        }),
    };
});

// PART 1
let valves = [{
  ...valvesById.AA,
  visitedValves: [],
  flow: 0,
  remainingSteps: 30,
}];
let maxFlow = 0;

while (valves.length) {
  const { flowRate, valvesToVisit, visitedValves, flow, remainingSteps } = valves.pop();

  const newFlow = flow + flowRate * remainingSteps;
  if (newFlow > maxFlow) {
    maxFlow = newFlow;
  }

  const remainingToVisit = valvesToVisit.filter(({ id }) => !visitedValves.includes(id));

  for (const { id: nextId, dist } of remainingToVisit) {
    if (remainingSteps > dist + 1) {
      valves.push({
        ...valvesById[nextId],
        visitedValves: [...visitedValves, nextId],
        flow: newFlow,
        remainingSteps: remainingSteps - dist - 1,
      });
    }
  }
}

console.log(maxFlow)

// PART 2
valves = [{
  ...valvesById.AA,
  visitedValves: [],
  flow: 0,
  remainingSteps: 26,
}];
const allPaths = {};

while (valves.length) {
  const { flowRate, valvesToVisit, visitedValves, flow, remainingSteps } = valves.pop();

  const newFlow = flow + flowRate * remainingSteps;
  allPaths[visitedValves.join(',')] = newFlow;

  const remainingToVisit = valvesToVisit.filter(({ id }) => !visitedValves.includes(id));

  for (const { id: nextId, dist } of remainingToVisit) {
    if (remainingSteps > dist + 1) {
      valves.push({
        ...valvesById[nextId],
        visitedValves: [...visitedValves, nextId],
        flow: newFlow,
        remainingSteps: remainingSteps - dist - 1,
      });
    }
  }
}

const allPathsArray = Object.entries(allPaths);
maxFlow = 0;

for (let ind1 = 0; ind1 < allPathsArray.length; ind1++) {
  const [path1Str, flow1] = allPathsArray[ind1];
  const path1 = new Set(path1Str.split(','));

  for (let ind2 = ind1 + 1; ind2 < allPathsArray.length; ind2++) {    
    const [path2Str, flow2] = allPathsArray[ind2];
    const path2 = path2Str.split(',');

    if (path2.every((visited2) => !path1.has(visited2)) && flow1 + flow2 > maxFlow) {
      maxFlow = flow1 + flow2;
    }
  }
}

console.log(maxFlow);
