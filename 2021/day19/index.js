const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');

const BEACONS_TO_MATCH = 12;

// const input = loadInput({ delimiter: '\n\n', filename: 'input_andy.txt' });
const input = loadInput({ test, delimiter: '\n\n' });

// helpers for both parts
const scanners = input.map((scannerInput, index) => {
  const scannerRows = scannerInput.split('\n');
  const beacons = scannerRows.slice(1).map(
    (beaconStr, beaconId) => ({
      beaconId,
      position: beaconStr.split(',').map(str => parseInt(str)),
      beaconVectors: [],
    })
  );
  return {
    id: parseInt(scannerRows[0].match(/scanner (\d+)/)[1]),
    beacons,
    position: (index === 0) ? [0, 0, 0] : null,
  }
});

function vectorDiff(vector1, vector2) {
  return vector2.map((coord, i) => vector1[i] - coord);
}

function vectorAdd(...vectors) {
  switch (vectors.length) {
    case 1:
      return vectors[0];
    case 2:
      return vectors[0].map((coord, i) => coord + vectors[1][i]);
    default:
      const sumOfRest = vectorAdd(...vectors.slice(1));
      return vectors[0].map((coord, i) => coord + sumOfRest[i]);
  }
}

function getVector(pos1, pos2) {
  const vector = vectorDiff(pos2, pos1);
  const distance = vector.reduce((dist, coord) => dist + coord*coord, 0);
  const reverseVector = vector.map(coord => -coord);
  return { vector, distance, reverseVector };
}

function calcBeaconVectors(beacons) {
  for (let i = 0; i < beacons.length; i++) {
    for (let j = i + 1; j < beacons.length; j++) {
      const { vector, distance, reverseVector } = getVector(beacons[i].position, beacons[j].position);
      beacons[i].beaconVectors.push({ id: j, vector, distance });
      beacons[j].beaconVectors.push({ id: i, vector: reverseVector, distance });
    }
  }
}

function matrixMult(matrix, vector) {
  return matrix.map(row => row.reduce((sum, n, j) => sum + n * vector[j], 0));
}

function getVectorMatches(targetVectors, matchVectors) {
  const rotationMatrices = [
    [[1, 0, 0], [0, 1, 0], [0, 0, 1]],    // rx 0
    [[1, 0, 0], [0, 0, -1], [0, 1, 0]],   // rx 90
    [[1, 0, 0], [0, -1, 0], [0, 0, -1]],  // rx 180
    [[1, 0, 0], [0, 0, 1], [0, -1, 0]],   // rx 270

    [[0, 0, 1], [0, 1, 0], [-1, 0, 0]],   // ry 90
    [[0, 1, 0], [0, 0, -1], [-1, 0, 0]],  // ry 90 rx 90
    [[0, 0, -1], [0, -1, 0], [-1, 0, 0]],  // ry 90 rx 180
    [[0, -1, 0], [0, 0, 1], [-1, 0, 0]],  // ry 90 rx 270

    [[-1, 0, 0], [0, 1, 0], [0, 0, -1]],   // ry 180
    [[-1, 0, 0], [0, 0, -1], [0, -1, 0]],  // ry 180 rx 90
    [[-1, 0, 0], [0, -1, 0], [0, 0, 1]],  // ry 180 rx 180
    [[-1, 0, 0], [0, 0, 1], [0, 1, 0]],  // ry 180 rx 270

    [[0, 0, -1], [0, 1, 0], [1, 0, 0]],   // ry 270
    [[0, -1, 0], [0, 0, -1], [1, 0, 0]],  // ry 270 rx 90
    [[0, 0, 1], [0, -1, 0], [1, 0, 0]],  // ry 270 rx 180
    [[0, 1, 0], [0, 0, 1], [1, 0, 0]],  // ry 270 rx 270

    [[0, -1, 0], [1, 0, 0], [0, 0, 1]],   // rz 90
    [[0, 0, 1], [1, 0, 0], [0, 1, 0]],  // rz 90 rx 90
    [[0, 1, 0], [1, 0, 0], [0, 0, -1]],  // rz 90 rx 180
    [[0, 0, -1], [1, 0, 0], [0, -1, 0]],  // rz 90 rx 270

    [[0, 1, 0], [-1, 0, 0], [0, 0, 1]],   // rz 270
    [[0, 0, -1], [-1, 0, 0], [0, 1, 0]],  // rz 270 rx 90
    [[0, -1, 0], [-1, 0, 0], [0, 0, -1]],  // rz 270 rx 180
    [[0, 0, 1], [-1, 0, 0], [0, -1, 0]],  // rz 270 rx 270
  ];
  // const rotationMatrices = [
  //   [ [ 1, 0, 0 ], [ 0, 1, 0 ], [ 0, 0, 1 ] ],
  //   [ [ 1, 0, 0 ], [ 0, 0, -1 ], [ 0, 1, 0 ] ],
  //   [ [ 1, 0, 0 ], [ 0, -1, -0 ], [ 0, 0, -1 ] ],
  //   [ [ 1, 0, 0 ], [ 0, 0, 1 ], [ 0, -1, 0 ] ],

  //   [ [ 0, 0, 1 ], [ 0, 1, 0 ], [ -1, 0, 0 ] ],
  //   [ [ 0, 1, 0 ], [ 0, 0, -1 ], [ -1, 0, 0 ] ],
  //   [ [ 0, 0, -1 ], [ 0, -1, 0 ], [ -1, 0, 0 ] ],
  //   [ [ 0, -1, 0 ], [ 0, 0, 1 ], [ -1, 0, 0 ] ],

  //   [ [ -1, 0, 0 ], [ 0, 1, 0 ], [ 0, 0, -1 ] ],
  //   [ [ -1, 0, 0 ], [ 0, 0, -1 ], [ 0, -1, -0 ] ],
  //   [ [ -1, 0, 0 ], [ 0, -1, 0 ], [ 0, 0, 1 ] ],
  //   [ [ -1, 0, 0 ], [ 0, 0, 1 ], [ 0, 1, 0 ] ],

  //   [ [ 0, 0, -1 ], [ 0, 1, 0 ], [ 1, 0, -0 ] ],
  //   [ [ 0, -1, 0 ], [ 0, 0, -1 ], [ 1, 0, 0 ] ],
  //   [ [ 0, 0, 1 ], [ 0, -1, 0 ], [ 1, 0, 0 ] ],
  //   [ [ 0, 1, 0 ], [ 0, 0, 1 ], [ 1, 0, 0 ] ],

  //   [ [ 0, -1, 0 ], [ 1, 0, 0 ], [ 0, 0, 1 ] ],
  //   [ [ 0, 0, 1 ], [ 1, 0, 0 ], [ 0, 1, 0 ] ],
  //   [ [ 0, 1, 0 ], [ 1, 0, 0 ], [ 0, 0, -1 ] ],
  //   [ [ 0, 0, -1 ], [ 1, 0, 0 ], [ 0, -1, 0 ] ],

  //   [ [ 0, 1, 0 ], [ -1, 0, 0 ], [ 0, 0, 1 ] ],
  //   [ [ 0, 0, -1 ], [ -1, 0, 0 ], [ 0, 1, 0 ] ],
  //   [ [ 0, -1, -0 ], [ -1, 0, 0 ], [ 0, 0, -1 ] ],
  //   [ [ 0, 0, 1 ], [ -1, 0, 0 ], [ 0, -1, 0 ] ]
  // ];
  const matchesByOrientation = rotationMatrices.map(rotationMatrix => {
    const possibleMatches = new Set(matchVectors.map(
      ({ vector }) => JSON.stringify(matrixMult(rotationMatrix, vector))
    ));
    const count = targetVectors.reduce((sum, target) => (
      sum + (possibleMatches.has(JSON.stringify(target.vector)) ? 1 : 0)
    ), 0);
    return { orientation: rotationMatrix, count };
  });
  return matchesByOrientation.reduce((a, b) => (b.count > a.count ? b : a));
}

function findBeaconMatch(targetBeacon, beacons) {
  for (const beacon of beacons) {
    const { count, orientation } = getVectorMatches(targetBeacon.beaconVectors, beacon.beaconVectors);
    if (count >= BEACONS_TO_MATCH - 1) {
      return { beacon, orientation };
    }
  }
  return null;
}

function locateScanner(scanner1, scanner2) {
  for (const beacon of scanner1.beacons) {
    const match = findBeaconMatch(beacon, scanner2.beacons);
    if (match) {
      const { beacon: matchBeacon, orientation } = match;

      scanner2.position = vectorDiff(beacon.position, matrixMult(orientation, matchBeacon.position));

      // console.dir({
      //   beacon: {
      //     beaconId: beacon.beaconId,
      //     position: beacon.position
      //   }, matchBeacon: {
      //     beaconId: matchBeacon.beaconId,
      //     position: matchBeacon.position
      //   },
      //   orientation,
      //   rotated: matrixMult(orientation, matchBeacon.position),
      //   scanner1pos: scanner1.position,
      //   scanner2pos: scanner2.position
      // }, { depth: null });

      scanner2.beacons = scanner2.beacons.map(beacon => ({
        ...beacon,
        position: vectorAdd(scanner2.position, matrixMult(orientation, beacon.position)),
        beaconVectors: beacon.beaconVectors.map(v => ({ ...v, vector: matrixMult(orientation, v.vector) })),
      }));
      return true;
    }
  }
  return false;
}

function manhattanDistance(vector1, vector2) {
  return vector2.map((coord, i) => Math.abs(vector1[i] - coord)).reduce((sum, val) => sum + val);
}

// PART 1
for (const scanner of scanners) {
  calcBeaconVectors(scanner.beacons);
}

// console.dir(scanners, { depth: null });

const pairedScanners = [];
const notLocatedScanners = new Set(scanners.slice(1));
const scannersToPair = [scanners[0]];

while (notLocatedScanners.size) {
  if (scannersToPair.length == 0) {
    console.log('Oops');
    console.dir(notLocatedScanners);
    throw Error('No scanners to pair!');
  }
  const scannerToPair = scannersToPair.pop();
  for (const scanner of notLocatedScanners) {
    // console.log('checking', scannerToPair.id, 'and', scanner.id);
    const couldLocate = locateScanner(scannerToPair, scanner);
    if (couldLocate) {
      // console.log('found a pair')
      scannersToPair.push(scanner);
      notLocatedScanners.delete(scanner);
    }
  }
  pairedScanners.push(scannerToPair);
}

let beaconStrings = new Set();
scanners.forEach(scanner => scanner.beacons.forEach(beacon => {
  beaconStrings.add(JSON.stringify(beacon.position));
}));

console.log('num unique beacons:', beaconStrings.size);


// PART 2
let maxDistance = 0;
for (let i = 0; i < scanners.length; i++) {
  for (let j = i + 1; j < scanners.length; j++) {
    maxDistance = Math.max(maxDistance, manhattanDistance(scanners[i].position, scanners[j].position))
  }
}

console.log('max manhattan distance:', maxDistance);
