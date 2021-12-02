const loadInput = require('../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const tileStrings = loadInput({ test, delimiter: '\n\n' });

// START CODE FOR DAY'S PUZZLES HERE
const reverseStr = (str) => str.split('').reverse().join('');

const rotate90cwArr = matrix => matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
const rotate90cw = stringArray => {
    const matrix = stringArray.map(str => str.split(''));
    const rotatedMatrix = rotate90cwArr(matrix);
    return rotatedMatrix.map(arr => arr.join(''));
}

// PART 1

// transform input file to tile objects with id, image, edges, matches (initialized empty)
const tiles = tileStrings.reduce((tilesById, tileString) => {
    const [idStr, ...image] = tileString.split('\n');
    const [id] = idStr.match(/\d+/);
    const baseEdges = {
        top: image[0],
        right: image.map(row => row.slice(-1)[0]).join(''),
        bottom: reverseStr(image.slice(-1)[0]),
        left: reverseStr(image.map(row => row[0]).join('')),
    };
    const flippedEdges = {};
    for (let edge in baseEdges) {
        flippedEdges[edge] = reverseStr(baseEdges[edge]);
    }
    const matches = {};
    tilesById[id] = { id, image, baseEdges, flippedEdges, matches };
    return tilesById;
}, {});

// get matches for all tiles
Object.values(tiles).forEach(baseTile => {
    Object.entries(baseTile.baseEdges).forEach(([baseEdgeKey, edgeVal]) => {
        if (Object.keys(baseTile.matches).length === 4) return;
        for (let matchTile of Object.values(tiles)) {
            if (matchTile.id === baseTile.id || Object.keys(matchTile.matches).length === 4) continue;
            for (let matchEdgeKey in matchTile.baseEdges) {
                if (edgeVal === matchTile.baseEdges[matchEdgeKey]) {
                    baseTile.matches[baseEdgeKey] = { id: matchTile.id, matchToEdge: matchEdgeKey, edge: baseEdgeKey, matchFlip: true };
                    matchTile.matches[matchEdgeKey] = { id: baseTile.id, matchToEdge: baseEdgeKey, edge: matchEdgeKey, matchFlip: true };
                    return;
                }
                if (edgeVal === matchTile.flippedEdges[matchEdgeKey]) {
                    baseTile.matches[baseEdgeKey] = { id: matchTile.id, matchToEdge: matchEdgeKey, edge: baseEdgeKey, matchFlip: false };
                    matchTile.matches[matchEdgeKey] = { id: baseTile.id, matchToEdge: baseEdgeKey, edge: matchEdgeKey, matchFlip: false };
                    return;
                }
            }
        }
    });
});

// find corners
const corners = Object.values(tiles).filter(({ matches }) => Object.keys(matches).length === 2);

const cornerProduct = corners.reduce((product, { id }) => product * id, 1);

console.log(cornerProduct);


// PART 2

// functions to transform matches and image
const keys = ['top', 'right', 'bottom', 'left'];
const transformMatches = (matches, transformations, targetKey) => {
    const { rotations, flip } = transformations;
    const rotatedMatches = keys.reduce((rotated, matchKey, i) => {
        rotated[matchKey] = matches[keys[(i + 4 - rotations) % 4]];
        if (rotated[matchKey]) {
            rotated[matchKey].edge = matchKey;
        }
        return rotated;
    }, {});
    if (!flip) return rotatedMatches;

    const keysFlippedInPlace = [targetKey, keys[(keys.indexOf(targetKey) + 2) % 4]];
    const swappedKeys = keys.filter(key => !keysFlippedInPlace.includes(key));

    const transformedMatches = {};

    keysFlippedInPlace.forEach(key => {
        if (rotatedMatches[key]) {
            transformedMatches[key] = { ...rotatedMatches[key], matchFlip: !rotatedMatches[key].matchFlip };
        }
    });
    transformedMatches[swappedKeys[0]] = rotatedMatches[swappedKeys[1]] ? { ...rotatedMatches[swappedKeys[1]], edge: swappedKeys[0] } : null;
    transformedMatches[swappedKeys[1]] = rotatedMatches[swappedKeys[0]] ? { ...rotatedMatches[swappedKeys[0]], edge: swappedKeys[1] } : null;
    return transformedMatches;
}

const transformImage = (image, transformations, targetKey) => {
    const { rotations, flip } = transformations;

    const imageNoBorders = image.slice(1, -1).map(imgRow => imgRow.slice(1, -1));

    let rotatedImage = imageNoBorders;
    switch (rotations) {
        case 1:
            rotatedImage = rotate90cw(imageNoBorders);
            break;
        case 2:
            rotatedImage = rotate90cw(rotate90cw(imageNoBorders));
            break;
        case 3:
            rotatedImage = rotate90cw(rotate90cw(rotate90cw(imageNoBorders)));
            break;
    }

    if (!flip) return rotatedImage;
    
    if (targetKey === 'left') {
        return rotatedImage.reverse();
    }

    return rotatedImage.map(row => reverseStr(row));
}

// function to add a tile to image grid
const addToGrid = ({ tile, pos, tileGrid, tileIdsRemaining }) => {
    const { id, matches } = tile;

    // find transformations needed to position on grid
    let transformations = { rotations: 0, flip: false };
    let targetKey;

    if (pos[0] === 0 && pos[1] === 0) {
        const currSides = new Set(Object.keys(matches).filter(key => matches[key]));
        switch (true) {
            case (currSides.has('top') && currSides.has('right')):
                transformations.rotations = 1;
                break;
            case (currSides.has('top') && currSides.has('left')):
                transformations.rotations = 2;
                break;
            case (currSides.has('bottom') && currSides.has('left')):
                transformations.rotations = 3;
                break;
            default:
                break;
        }
    } else {
        targetKey = (pos[1] === 0) ? 'top' : 'left';
        const connector = (pos[1] === 0)
            ? tileGrid[pos[0] - 1][pos[1]].matches.bottom
            : tileGrid[pos[0]][pos[1] - 1].matches.right;
        const currMatchEdge = matches[connector.matchToEdge].edge;
        transformations.rotations = (4 + keys.indexOf(targetKey) - keys.indexOf(currMatchEdge)) % 4;
        transformations.flip = connector.matchFlip;
    }

    // update matches
    const transformedMatches = transformMatches(matches, transformations, targetKey);
    Object.values(transformedMatches).forEach(newMatch => {
        if (newMatch) {
            const { id, edge, matchToEdge, matchFlip } = newMatch;
            if (tileIdsRemaining.has(id)) {
                const matchTile = tiles[id];
                matchTile.matches[matchToEdge].matchToEdge = edge;
                matchTile.matches[matchToEdge].matchFlip = matchFlip;
            }
        }
    });
    tile.matches = transformedMatches;

    // update image
    tile.image = transformImage(tile.image, transformations, targetKey);

    tileIdsRemaining.delete(id);
    tileGrid[pos[0]][pos[1]] = tile;
}


// start of part 2 script - initialize tileGrid and iterate over each space to find tile that goes there
const imageSize = Object.keys(tiles).length ** (.5);
const tileIdsRemaining = new Set(Object.keys(tiles));
const tileGrid = new Array(imageSize).fill().map(() => new Array(imageSize));

for (let y = 0; y < imageSize; y++) {
    for (let x = 0; x < imageSize; x++) {
        if (x === 0) {
            if (y === 0) currTile = corners[0];
            else currTile = tiles[tileGrid[y-1][x].matches.bottom.id];
        } else {
            currTile = tiles[currTile.matches.right.id];
        }
        addToGrid({ tile: currTile, pos: [y, x], tileGrid, tileIdsRemaining});
    }
}

// piece full image together
const fullImage = tileGrid.reduce((img, tileRow) => {
    const tileRowSection = tileRow.reduce((rowSection, tile) => {
        if (rowSection.length) {
            return rowSection.map((row, ind) => row + tile.image[ind]);
        } else {
            return tile.image;
        }
    }, []);
    return img.concat(tileRowSection);
}, []);

// console.log(fullImage)

// function to look for sea monsters
const seaMonster = [
    /^..................#./g,
    /^#....##....##....###/g,
    /^.#..#..#..#..#..#.../g,
];

// const seaMonsterAtIndex = (imgRows, ind) => {
//     const row1 = seaMonster[1].test(imgRows[1].slice(ind));
//     const row2 = seaMonster[2].test(imgRows[2].slice(ind));
//     return (row1 && row2)
// };

const countSeaMonsters = (image) => {
    const seaMonsterWidth = 20;
    const seaMonsterHeight = 3;
    const seaMonsterAtIndex = (xInd, yInd) => {
        const row1 = seaMonster[0].test(image[yInd].slice(xInd));
        const row2 = seaMonster[1].test(image[yInd+1].slice(xInd));
        const row3 = seaMonster[2].test(image[yInd+2].slice(xInd));
        if (xInd === 51 && yInd === 9) {
          console.dir({ row1, row2, row3 })
          console.dir({ img: [image[yInd].slice(xInd), image[yInd+1].slice(xInd), image[yInd+2].slice(xInd)] })
        }
        return (row1 && row2 && row3);
    };
    let count = 0;
    for (let y = 0; y <= (image.length - seaMonsterHeight); y++) {
        for (let x = 0; x <= (image[0].length - seaMonsterWidth); x++) {
            if (seaMonsterAtIndex(x, y)) {
                console.dir({x, y})
                count++;
            }
        }
    }
    return count;
}



// const seaMonstersInSlice = (image, rowInd) => {
//     if (image.length - rowInd < 3) return 0;
//     let imgSlice = image.slice(rowInd, rowInd + 3);
//     let startInd = 0;
//     let monsterCount = 0;

//     while ((startInd + 20) <= imgSlice[0].length) {
//         startInd = imgSlice[0].search(seaMonster[0]);
//         if (startInd < 0) break;
//         if (seaMonsterAtIndex(imgSlice, startInd)) monsterCount++;
//         imgSlice = imgSlice.map(row => row.slice(startInd + 1));
//     }

//     return monsterCount;
// }

// const countSeaMonsters = (image) => {
//     return image.reduce(
//         (numSeaMonstersTotal, _, ind) => numSeaMonstersTotal + seaMonstersInSlice(image, ind),
//         0
// )};

const countSeaMonstersAllRotations = (originalImage) => {
    let image = [...originalImage];
    let rotations = 0;

    while (rotations < 4) {
        const seaMonsterCount = countSeaMonsters(image);
        if (seaMonsterCount) return seaMonsterCount;
        image = rotate90cw(image);
        rotations++;
    }

    return 0;
}

const countSeaMonstersAllOrientations = (image) => {
    let seaMonsterCount = countSeaMonstersAllRotations(image);
    if (seaMonsterCount) return seaMonsterCount;

    seaMonsterCount = countSeaMonstersAllRotations([...image].reverse());
    if (seaMonsterCount) return seaMonsterCount;

    seaMonsterCount = countSeaMonstersAllRotations(image.map(row => reverseStr(row)));
    if (seaMonsterCount) return seaMonsterCount;

    return 0;
}

const totalSeaMonsters = countSeaMonstersAllOrientations(fullImage);
console.log(totalSeaMonsters)

const totalHash = fullImage.reduce((hashCount, row) => hashCount + row.split('').filter(char => char === '#').length, 0);

const roughness = totalHash - (15 * totalSeaMonsters);

console.log(roughness)

// let ids = tileGrid.map(tileRow => tileRow.map(tile => +tile.id));
// console.log(ids);
// ids = rotate90cwArr(ids);
// ids = ids.reverse()
// console.log(ids);

// let image = [...fullImage];
// image = rotate90cw(rotate90cw(image));
// image = image.reverse();
// console.log(image);

// console.log(countSeaMonsters(image))


// const testimg = [
// '.#.#...#.###...#.##.##..',
// '#.#.##.###.#.##.##.#####',
// '..##.###.####..#.####.##',
// ];

// console.log(hasSeaMonster(testimg, 0))
// console.log(hasSeaMonster(image, 2))
