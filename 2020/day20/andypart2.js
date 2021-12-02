/**
 * Solutions for Advent of Code 2020, Day 20, Part 2.
 * Original problem: https://adventofcode.com/2020/day/20
 */


let testInput = [
  'Tile 2311:\n..##.#..#.\n##..#.....\n#...##..#.\n####.#...#\n##.##.###.\n##...#.###\n.#.#.#..##\n..#....#..\n###...#.#.\n..###..###',
  'Tile 1951:\n#.##...##.\n#.####...#\n.....#..##\n#...######\n.##.#....#\n.###.#####\n###.##.##.\n.###....#.\n..#.#..#.#\n#...##.#..',
  'Tile 1171:\n####...##.\n#..##.#..#\n##.#..#.#.\n.###.####.\n..###.####\n.##....##.\n.#...####.\n#.##.####.\n####..#...\n.....##...',
  'Tile 1427:\n###.##.#..\n.#..#.##..\n.#.##.#..#\n#.#.#.##.#\n....#...##\n...##..##.\n...#.#####\n.#.####.#.\n..#..###.#\n..##.#..#.',
  'Tile 1489:\n##.#.#....\n..##...#..\n.##..##...\n..#...#...\n#####...#.\n#..#.#.#.#\n...#.#.#..\n##.#...##.\n..##.##.##\n###.##.#..',
  'Tile 2473:\n#....####.\n#..#.##...\n#.##..#...\n######.#.#\n.#...#.#.#\n.#########\n.###.#..#.\n########.#\n##...##.#.\n..###.#.#.',
  'Tile 2971:\n..#.#....#\n#...###...\n#.#.###...\n##.##..#..\n.#####..##\n.#..####.#\n#..#.#..#.\n..####.###\n..#.#.###.\n...#.#.#.#',
  'Tile 2729:\n...#.#.#.#\n####.#....\n..#.#.....\n....#..#.#\n.##..##.#.\n.#.####...\n####.#.#..\n##.####...\n##..#.##..\n#.##...##.',
  'Tile 3079:\n#.#.#####.\n.#..######\n..#.......\n######....\n####.#..#.\n.#...#.##.\n#.#####.##\n..#.###...\n..#.......\n..#.###...',
];

// let input = testInput;
// let input = require('../../lib/get-input').getInput({delimiter: '\n\n'});

const loadInput = require('../../lib/loadInput');

const input = loadInput({ delimiter: '\n\n' });

let tileMap = input.reduce((map, tileLine) => {
  let lines = tileLine.split('\n');
  let tileNum = parseInt(/Tile (\d+)/.exec(lines[0])[1], 10);

  let pixels = [];
  for (let i = 1; i < lines.length; i++) {
    pixels[i - 1] = lines[i].split('').map(val => val === '.' ? 0 : 1);
  }


  let tile = addDerivedFields({
    tileNum,
    pixels,
  });

  map.set(tileNum, tile);

  return map;
}, new Map());

function addDerivedFields(tile) {
  let pixels = tile.pixels;

  let left = [];
  let right = [];
  for (let i = 0; i < pixels.length; i++) {
    left.push(pixels[i][0]);
    right.push(pixels[i][pixels[i].length - 1]);
  }

  tile.leftEdge = parseInt(left.join(''), 2);
  tile.leftEdge2 = parseInt(left.reverse().join(''), 2);

  tile.rightEdge = parseInt(right.join(''), 2);
  tile.rightEdge2 = parseInt(right.reverse().join(''), 2);

  tile.topEdge = parseInt(pixels[0].join(''), 2);
  tile.topEdge2 = parseInt([...pixels[0]].reverse().join(''), 2);

  tile.bottomEdge = parseInt(pixels[pixels.length - 1].join(''), 2);
  tile.bottomEdge2 = parseInt([...pixels[pixels.length - 1]].reverse().join(''), 2);

  tile.edges = new Set([tile.topEdge, tile.rightEdge, tile.bottomEdge, tile.leftEdge]);
    // In our binary representation if you flip a tile  you change the binary number that represents
    // it. But if you flip twice it's the same as a two rotations.
  tile.edgesFlipH = new Set([tile.topEdge2, tile.rightEdge, tile.bottomEdge2, tile.leftEdge]);
  tile.edgesFlipV = new Set([tile.topEdge, tile.rightEdge2, tile.bottomEdge, tile.leftEdge2]);

  tile[tile.topEdge] = 'topEdge';
  tile[tile.topEdge2] = 'topEdge2';
  tile[tile.rightEdge] = 'rightEdge';
  tile[tile.rightEdge2] = 'rightEdge2';
  tile[tile.bottomEdge] = 'bottomEdge';
  tile[tile.bottomEdge2] = 'bottomEdge2';
  tile[tile.leftEdge] = 'leftEdge';
  tile[tile.leftEdge2] = 'leftEdge2';

  return tile;
}

function flipMatrixVertically(matrix) {
  return matrix.map((row, i) => matrix[matrix.length - 1 - i]);
}

function flipTileVertically(tile) {
  tile.pixels = flipMatrixVertically(tile.pixels);

  return addDerivedFields(tile);
}

function flipMatrixHorizontally(matrix) {
  return matrix.map(row => row.map((col, index) => {
    return row[row.length - 1 - index];
  }));
}


function flipTileHorizontally(tile) {
  tile.pixels = flipMatrixVertically(tile.pixels);

  return addDerivedFields(tile);
}

function rotateMatrixClockwise(matrix) {
  return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse());
}

function rotateTileClockwise(tile) {
    // Turns each column into rows of the same index, then reverses them to rotate.
    tile.pixels = rotateMatrixClockwise(tile.pixels);

    return addDerivedFields(tile);
}

function hasMatchingBorder(tile1, tile2) {
  // It's a match if any orientation of tile 2 has edges that match 1.
  let matches = [...tile1.edges].filter(
      edge => tile2.edges.has(edge) || tile2.edgesFlipH.has(edge) || tile2.edgesFlipV.has(edge));

  if (matches.length == 1) {
    return true;
  }

  return false;
}

let matchingEdgeMap = {
  'topEdge': 'bottomEdge',
  'bottomEdge': 'topEdge',
  'leftEdge': 'rightEdge',
  'rightEdge': 'leftEdge',
};

function attachAdjacentTile(tile1, tile2) {
  // console.log('attachAdjacentTile', tile1.tileNum, tile2.tileNum);

  let tile1EdgeArray = [...tile1.edges];

  let [matchingEdge] = tile1EdgeArray.filter(
      edge => tile2.edges.has(edge) || tile2.edgesFlipH.has(edge) || tile2.edgesFlipV.has(edge));

  let edgeNameT1 = tile1[matchingEdge];
  let edgeNameT2 = tile2[matchingEdge];

  // Try all permutations of tile2 arrangements until you find a match.
  if (edgeNameT2 != matchingEdgeMap[edgeNameT1]) {
    for (let i = 0; i < 4 && edgeNameT2 != matchingEdgeMap[edgeNameT1]; i++) {
      tile2 = rotateTileClockwise(tile2);
      edgeNameT2 = tile2[matchingEdge];
    }
  }

  if (edgeNameT2 != matchingEdgeMap[edgeNameT1]) {
    tile2 = flipTileVertically(tile2);
    for (let i = 0; i < 4 && edgeNameT2 != matchingEdgeMap[edgeNameT1]; i++) {
      tile2 = rotateTileClockwise(tile2);
      edgeNameT2 = tile2[matchingEdge];
    }
  }

  if (edgeNameT2 != matchingEdgeMap[edgeNameT1]) {
    // undo
    tile2 = flipTileVertically(tile2);

    tile2 = flipTileHorizontally(tile2);
    for (let i = 0; i < 4 && edgeNameT2 != matchingEdgeMap[edgeNameT1]; i++) {
      tile2 = rotateTileClockwise(tile2);
      edgeNameT2 = tile2[matchingEdge];
    }
  }

  if (edgeNameT2 != matchingEdgeMap[edgeNameT1]) {
    throw Error('gah bad algorithm andy');
  }

  // Remove 'Edge' suffix to get the link property name.
  let linkNameT1 = edgeNameT1.slice(0, edgeNameT1.length - 4);
  let linkNameT2 = edgeNameT2.slice(0, edgeNameT2.length - 4);

  tile1[linkNameT1] = tile2;
  tile2[linkNameT2] = tile1;

  // console.log(tile1.tileNum, linkNameT1, tile2.tileNum);
  // console.log(tile2.tileNum, linkNameT2, tile1.tileNum);

  let numAttached = 0;
  if (tile1.top) numAttached++;
  if (tile1.left) numAttached++;
  if (tile1.right) numAttached++;
  if (tile1.bottom) numAttached++;
  tile1.numAttached = numAttached;

  numAttached = 0;
  if (tile2.top) numAttached++;
  if (tile2.left) numAttached++;
  if (tile2.right) numAttached++;
  if (tile2.bottom) numAttached++;
  tile2.numAttached = numAttached;

  return tile2;
}

function attachAllAdjacentTiles(tile) {
  // console.log('attachAllAdjacentTiles', tile.tileNum);

  // Doesn't make all attachment links
  tile.adjacentTiles.forEach(tile2 => {
    if (tile2 != tile.top &&
        tile2 != tile.right &&
        tile2 != tile.bottom &&
        tile2 != tile.left) {
      attachAdjacentTile(tile, tile2);
    }
  });

  tile.adjacentTiles.forEach(tile2 => {
    if (tile2.numAttached != tile2.adjacentTiles.length) {
      attachAllAdjacentTiles(tile2);
    }
  });
}

let tileArray = [...tileMap.values()];
let numTiles = tileArray.length;

// Product of Corners is the answer for part 1, but just getting this
// isn't sufficient for part 2. We really need to do what they ask and put
// together all the images, not just identify corners.
let productOfCorners = 1;
let corners = [];
tileArray.forEach((tile, index) => {
  tile.adjacentTiles = [];
  for (let i = 0; i < tileArray.length; i++) {
    if (i == index) continue;
    if (hasMatchingBorder(tile, tileArray[i])) {
      tile.adjacentTiles.push(tileArray[i]);
    }
  }

  if (tile.adjacentTiles.length == 2) {
    productOfCorners *= tile.tileNum;
    corners.push(tile);
  }
});

corners[0].attached = true;
attachAllAdjacentTiles(corners[0]);

let rowStart = corners.find(tile => tile.left === undefined && tile.top === undefined);

let rows = [];
while (rowStart) {
  let row = [rowStart.tileNum];
  let node = rowStart;
  while (node.right) {
    node = node.right;
    row.push(node.tileNum);
  }
  rows.push(row);
  rowStart = rowStart.bottom;
}

console.log(rows)

let image = rows.reduce((img, row, rowIndex) => {
  img = img.concat(row.reduce((arr, tileNum, index) => {
    let pixels = tileMap.get(tileNum).pixels;


    for (let i = 1; i < pixels.length - 1; i++) {
      if (index === 0) {
        arr.push([]);
      }

      for (let j = 1; j < pixels[i].length - 1; j++) {
        arr[i - 1].push(pixels[i][j]);
      }
    }

    return arr;
  }, []));
  return img;
}, []);

// console.log(rows);

let seaMonsterInput = '                  # \n#    ##    ##    ###\n #  #  #  #  #  #   ';
let seaMonsterPixels = seaMonsterInput.split('\n').map(line => line.split('').map(val => val === ' ' ? null : 1));

function seaMonsterInBox(pixels, topLeftY, topLeftX) {
  // If the sea monster box doesn't fit in the image it clearly isn't there.
  if (topLeftX + seaMonsterPixels[0].length >= pixels[0].length ||
      topLeftY + seaMonsterPixels.length > pixels.length) {
    return false;
  }

  for (let y = 0; y < seaMonsterPixels.length; y++) {
    for (let x = 0; x < seaMonsterPixels[0].length; x++) {
      if (seaMonsterPixels[y][x] === 1 &&
          pixels[topLeftY + y][topLeftX + x] !== seaMonsterPixels[y][x]) {
        return false;
      }
    }
  }
  console.dir({ topLeftX, topLeftY})
  return true;
}

function getNumSeaMonsters(image) {
  let numSeaMonsters = 0;
  for (let i = 0; i < 4; i++) {
    for (let y = 0; y < image.length; y++) {
      for (let x = 0; x < image[0].length; x++) {
        if (seaMonsterInBox(image, y, x)) {
          numSeaMonsters++;
        }
      }
    }
    // Rotate clockwise.
    image = rotateMatrixClockwise(image);
  }

  return numSeaMonsters;
}

let numSeaMonsters = getNumSeaMonsters(image);
if (numSeaMonsters === 0) {
  image = flipMatrixVertically(image);
  numSeaMonsters = getNumSeaMonsters(image);
  image = flipMatrixVertically(image);
}

if (numSeaMonsters === 0) {
  image = flipMatrixHorizontally(image);
  numSeaMonsters = getNumSeaMonsters(image);
}

totalHashCount = image.reduce((count, row) => count + row.reduce((count, value) => count + value, 0), 0);
seaMonsterHashCount = seaMonsterPixels.reduce((count, row) => count + row.reduce((count, value) => count + value, 0), 0);

console.dir({
  totalHashCount,
  seaMonsterHashCount,
  numSeaMonsters,
  totalNotMonster: totalHashCount - seaMonsterHashCount * numSeaMonsters
})

console.dir({
  numTiles,
  productOfCorners
});