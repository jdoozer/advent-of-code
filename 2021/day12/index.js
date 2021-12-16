const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });
// const input = loadInput({ test, filename: 'test_input3.txt' });

// helpers for both parts
const isStart = cave => cave.name === 'start';
const isEnd = cave => cave.name === 'end';
const isSmall = cave => cave.name === cave.name.toLowerCase();

const addConnection = (map, name1, name2) => {
    if (!isStart(name1) && !isEnd(name2)) {
        map[name2].connections.add(name1);
    }
};

// PART 1
// iterate over our input to make a cave map
let caveMap = {};
input.forEach(row => {
    const caveNames = row.split('-');
    for (let name of caveNames) {
        if (!caveMap[name]) {
            caveMap[name] = {
                name,
                connections: new Set(),
            };
        }
    }
    addConnection(caveMap, caveNames[0], caveNames[1]);
    addConnection(caveMap, caveNames[1], caveNames[0]);
});

console.log(caveMap);

// now we want to find all possible paths
function countPaths1(curr, visited) {
    if (isEnd(curr)) {
        return 1;
    }

    const connections = [...curr.connections];
    if (connections.every(cave => visited.has(cave))) {
        return 0;
    }

    return connections.reduce((numPaths, nextName) => {
        if (visited.has(nextName)) {
            return numPaths;
        }

        const visitedNew = isSmall(curr) ? new Set(visited).add(curr.name) : visited;
        return numPaths + countPaths1(caveMap[nextName], visitedNew);
    }, 0);
}

console.log(countPaths1(caveMap.start, new Set()));

// PART 2
function countPaths2(curr, cannotVisit, visited, allowExtra) {
    if (isEnd(curr)) {
        return 1;
    }

    const connections = [...curr.connections];
    if (connections.every(cave => cannotVisit.has(cave))) {
        return 0;
    }

    return connections.reduce((numPaths, nextName) => {
        const visitedNew = isSmall(curr) ? new Set(visited).add(curr.name) : visited;

        let cannotVisitNew = cannotVisit;
        if (isStart(curr) || (isSmall(curr) && !allowExtra)) {
            cannotVisitNew = new Set(cannotVisitNew).add(curr.name);
        }

        if (isSmall(curr) && !isStart(curr) && visited.has(curr.name) && allowExtra) {
            allowExtra = false;
            cannotVisitNew = new Set([...visitedNew]);
        }

        if (cannotVisitNew.has(nextName) || (visitedNew.has(nextName) && !allowExtra)) {
            return numPaths;
        }

        return numPaths + countPaths2(caveMap[nextName], cannotVisitNew, visitedNew, allowExtra);
    }, 0);
}

console.log(countPaths2(caveMap.start, new Set(), new Set(), true));
