const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
let testInput;

// testInput = [
//   '--- scanner 0 ---\n0,2\n4,1\n3,3',
//   '--- scanner 1 ---\n-1,-1\n-5,0\n-2,1',
// ];

const input = (test && testInput) ? testInput : loadInput({ test, delimiter: '\n\n' });

// helpers for both parts
const scanners = input.map(scannerInput => {
  const scannerRows = scannerInput.split('\n');
  const beacons = scannerRows.slice(1).map(
    (beaconStr, beaconId) => ({
      beaconId,
      position: beaconStr.split(',').map(str => parseInt(str)),
      distances: [],
    })
  );
  return {
    id: parseInt(scannerRows[0].match(/scanner (\d+)/)[1]),
    beacons,
  }
});

function getDistance(pos1, pos2) {
  const diff = pos1.map((coord1, ind) => coord1 - pos2[ind]);
  return diff.reduce((dist, coord) => dist + coord*coord, 0);
}

function calcBeaconDistances(beacons) {
  for (let i = 0; i < beacons.length; i++) {
    for (let j = i + 1; j < beacons.length; j++) {
      const distance = getDistance(beacons[i].position, beacons[j].position);
      beacons[i].distances.push({ id: j, distance });
      beacons[j].distances.push({ id: i, distance });
    }
    beacons[i].distances.sort(({ distance: d1 }, { distance: d2 }) => d1 - d2);
  }
}

function countMatches(arr1, arr2) {
  let ind1 = 0;
  let ind2 = 0;
  let count = 0;
  while (ind1 < arr1.length && ind2 < arr2.length) {
    if (arr1[ind1] === arr2[ind2]) {
      count++;
      ind1++;
      ind2++;
    } else if (arr1[ind1] < arr2[ind2]) {
      ind1++;
    } else {
      ind2++;
    }
  }
  return count;
}

function findBeaconMatch(targetBeacon, beacons) {
  let foundMatch = null;
  const targetDistances = targetBeacon.distances.map(({ distance }) => distance);
  for (const beacon of beacons) {
    const beaconDistances = beacon.distances.map(({ distance }) => distance);
    const matches = countMatches(targetDistances, beaconDistances);
    // console.dir({ targetBeacon, beacon, matches }, { depth: null })
    if (matches >= 11) {
      if (foundMatch) {
        throw new Error('too many matches!!!');
      } else {
        foundMatch = beacon;
      }
    }
  }
  return foundMatch;
}

function findOverlappingBeaconCount(scanner1, scanner2) {
  const overlapping = scanner1.beacons.filter(beacon => !!findBeaconMatch(beacon, scanner2.beacons));
  return overlapping.length;
}

// PART 1
for (const scanner of scanners) {
  calcBeaconDistances(scanner.beacons);
}

// console.dir(scanners, { depth: null });

const totalBeaconCount = scanners.reduce((count, scanner) => count + scanner.beacons.length, 0);
let uniqueBeaconCount = totalBeaconCount;

for (let i = 0; i < scanners.length; i++) {
  for (let j = i + 1; j < scanners.length; j++) {
    const overlappingCount = findOverlappingBeaconCount(scanners[i], scanners[j]);
    if (overlappingCount >= 12) {
      uniqueBeaconCount -= overlappingCount;
    }
  }
}

console.log(uniqueBeaconCount);


// PART 2
