const loadInput = require('../../lib/loadInput');
const printMatrix = require('../../lib/printMatrix');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

const CHAMBER_WIDTH = 7;
const rocksRow = new Array(CHAMBER_WIDTH).fill(0);
const NUM_ROCKS_1 = 2022;
const NUM_ROCKS_2 = 1000000000000;

class BaseShape {
  constructor(shapeIndex) {
    switch (shapeIndex) {
      case 0:
        this.coords = [[0,0], [0,1], [0,2], [0,3]];
        break;
      case 1:
        this.coords = [[0,1], [1,0], [1,1], [1,2], [2,1]];
        break;
      case 2:
        this.coords = [[0,0], [0,1], [0,2], [1,2], [2,2]];
        break;
      case 3:
        this.coords = [[0,0], [1,0], [2,0], [3,0]];
        break;
      case 4:
        this.coords = [[0,0], [0,1], [1,0], [1,1]];
        break;
      default:
        throw new Error(`Value ${shapeIndex} is not a valid shape index`);
    }
    const edges = {
      left: { [this.coords[0][0]]: this.coords[0][1] },
      right: { [this.coords[0][0]]: this.coords[0][1] },
      bottom: { [this.coords[0][1]]: this.coords[0][0] },
    };
    this.coords.forEach(([y, x], i) => {
      if (i === 0) return;
      if (typeof edges.left[y] === 'undefined' || x < edges.left[y]) edges.left[y] = x;
      if (typeof edges.right[y] === 'undefined' || x > edges.right[y]) edges.right[y] = x;
      if (typeof edges.bottom[x] === 'undefined' || y < edges.bottom[x]) edges.bottom[x] = y;
    });

    this.left = Object.keys(edges.left).map(key => [+key, edges.left[key]]);
    this.right = Object.keys(edges.right).map(key => [+key, edges.right[key]]);
    this.bottom = Object.keys(edges.bottom).map(key => [edges.bottom[key], +key]);
  }
}

class Chamber {
  constructor() {
    this.rocks = [];
    this.jets = input[0];
    this.jetIndex = 0;
    this.shapeIndex = 0;
    this.baseShapes = [];
    for (let i = 0; i < 5; i++) {
      this.baseShapes[i] = new BaseShape(i);
    }
    this.shape = null;
    this.shapePos = null;
  }

  print() {
    printMatrix([...this.rocks].reverse(), { swaps: { 0: '.', 1: '#' }});
  }

  moveLeft() {
    const canMove = this.shape.left.every((coordPair) => {
      const y = this.shapePos[0] + coordPair[0];
      const x = this.shapePos[1] + coordPair[1];

      return x !== 0 && (!this.rocks[y] || !this.rocks[y][x-1]);
    });
    if (canMove) this.shapePos[1] = this.shapePos[1] - 1;
  }

  moveRight() {
    const canMove = this.shape.right.every((coordPair) => {
      const y = this.shapePos[0] + coordPair[0];
      const x = this.shapePos[1] + coordPair[1];

      if (x === CHAMBER_WIDTH - 1) return false;

      return !this.rocks[y] || !this.rocks[y][x+1];
    });
    if (canMove) this.shapePos[1] = this.shapePos[1] + 1;
  }

  moveDownOrFreeze() {
    const canMove = this.shape.bottom.every((coordPair) => {
      const y = this.shapePos[0] + coordPair[0];
      const x = this.shapePos[1] + coordPair[1];

      return y !== 0 && (!this.rocks[y-1] || !this.rocks[y-1][x]);
    });
    if (canMove) {
      this.shapePos[0] = this.shapePos[0] - 1;
    } else {
      this.shape.coords.forEach((coordPair) => {
        const y = this.shapePos[0] + coordPair[0];
        const x = this.shapePos[1] + coordPair[1];
        while (y >= this.rocks.length) {
          this.rocks.push([...rocksRow]);
        }
        this.rocks[y][x] = 1;
      });
    }
    return canMove;
  }

  dropShape() {
    this.shape = this.baseShapes[this.shapeIndex];
    this.shapePos = [this.rocks.length + 3, 2];

    let couldMoveDown = true;
    while (couldMoveDown) {
      this.jets[this.jetIndex] === '<' ? this.moveLeft() : this.moveRight();
      this.jetIndex = (this.jetIndex === this.jets.length - 1) ? 0 : this.jetIndex + 1;
      couldMoveDown = this.moveDownOrFreeze();
    }

    this.shapeIndex = (this.shapeIndex + 1) % 5;
  }

  dropNumShapes(n) {
    for (let i = 0; i < n; i++) {
      this.dropShape();
    }
  }
}

const c1 = new Chamber();
c1.dropNumShapes(NUM_ROCKS_1);
console.log(c1.rocks.length);


// PART 2
function getRepeatLength() {
  const chamber = new Chamber();
  const shapeJetMap = {};
  let key;
  let shapeCount = 0;

  let repeatCount = 0;

  while (true) {
    chamber.dropNumShapes(1);
    shapeCount++;  
    key = `${chamber.shapeIndex}-${chamber.jetIndex}`;

    if (shapeJetMap[key]) {
      const repeatLength = shapeCount - shapeJetMap[key];
      repeatCount = repeatCount + 1;
      if (repeatCount > 10) return shapeCount - shapeJetMap[key]; // wait until we've repeated 10 times
    }
    shapeJetMap[key] = shapeCount;
  }    
}

const repeatLength = getRepeatLength();
const c2 = new Chamber();
c2.dropNumShapes(NUM_ROCKS_2 % repeatLength);
const modHeight = c2.rocks.length;
c2.dropNumShapes(repeatLength);
const repeatHeight = c2.rocks.length - modHeight;
const numRepeats = Math.floor(NUM_ROCKS_2 / repeatLength);
const finalHeight = modHeight + repeatHeight * numRepeats;
console.log(finalHeight);
