const loadInput = require('../../lib/loadInput');
const printMatrix = require('../../lib/printMatrix');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

const rocksRow = new Array(7).fill(0);

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

class Shape {
  constructor({ shapes, shapeIndex, rocks, jets, jetIndex, top }) {
    this.shape = shapes[shapeIndex];
    this.rocks = rocks;
    this.jets = jets;
    this.jetIndex = jetIndex;
    this.position = [top + 3, 2];
  }

  moveLeft() {
    const canMove = this.shape.left.every((coordPair) => {
      const y = this.position[0] + coordPair[0];
      const x = this.position[1] + coordPair[1];

      return x !== 0 && (!this.rocks[y] || !this.rocks[y][x-1]);
    });
    if (canMove) this.position[1] = this.position[1] - 1
  }

  moveRight() {
    const canMove = this.shape.right.every((coordPair) => {
      const y = this.position[0] + coordPair[0];
      const x = this.position[1] + coordPair[1];

      if (this.rocks[0] && x === this.rocks[0].length - 1) return false;

      return !this.rocks[y] || !this.rocks[y][x+1];
    });
    if (canMove) this.position[1] = this.position[1] + 1;
  }

  moveDownOrFreeze() {
    const canMove = this.shape.bottom.every((coordPair) => {
      const y = this.position[0] + coordPair[0];
      const x = this.position[1] + coordPair[1];

      return y !== 0 && (!this.rocks[y-1] || !this.rocks[y-1][x]);
    });
    if (canMove) {
      this.position[0] = this.position[0] - 1;
    } else {
      this.shape.coords.forEach((coordPair) => {
        const y = this.position[0] + coordPair[0];
        const x = this.position[1] + coordPair[1];
        while (y > this.rocks.length - 1) {
          this.rocks.push([...rocksRow]);
        }
        this.rocks[y][x] = 1;
      })
    }
    return canMove;
  }

  drop() {
    let couldMoveDown = true;
    while (couldMoveDown) {
      // console.log(this.jets[this.jetIndex])
      this.jets[this.jetIndex] === '<' ? this.moveLeft() : this.moveRight();
      this.jetIndex = (this.jetIndex === this.jets.length - 1) ? 0 : this.jetIndex + 1;
      couldMoveDown = this.moveDownOrFreeze();
    }
    return { jetIndex: this.jetIndex, rocks: this.rocks }
  }
}

class Chamber {
  constructor() {
    this.rocks = [];
    this.top = 0,
    this.jets = input[0];
    this.jetIndex = 0;
    this.shapeIndex = 0;
    this.shapes = [];
    for (let i = 0; i < 5; i++) {
      this.shapes[i] = new BaseShape(i);
    }
  }
  print() {
    printMatrix([...this.rocks].reverse(), { swaps: { 0: '.', 1: '#' }});
  }
  dropShape() {
    const shape = new Shape(this);
    const { jetIndex, rocks } = shape.drop();

    this.jetIndex = jetIndex;
    this.rocks = rocks;
    this.shapeIndex = (this.shapeIndex + 1) % 5;
    this.top = rocks.length;
  }
  dropNumShapes(n) {
    for (let i = 0; i < n; i++) {
      this.dropShape();
    }
    console.log(this.rocks.length);
  }
}

const c = new Chamber();
c.dropNumShapes(10);
