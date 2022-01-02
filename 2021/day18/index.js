const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
let testInput;

// testInput = ['[[[[9,8],1],2],3]', '4'];
// testInput = ['7', '[6,[5,[4,[3,2]]]]'];
// testInput = ['[[[[0,7],4],[15,[0,13]]],[1,1]]'];
// testInput = ['[[[[4,3],4],4],[7,[[8,4],9]]]','[1,1]'];
// testInput = [
//   '[1,1]',
//   '[2,2]',
//   '[3,3]',
//   '[4,4]',
//   '[5,5]',
//   '[6,6]',
// ];

const input = (test && testInput) ? testInput : loadInput({ test });

// helper functions
class Node {
  constructor(value) {
    const isLeaf = !Array.isArray(value);
    this.isLeaf = isLeaf;
    this.value = isLeaf ? value : null;
    this.left = isLeaf ? null : new Node(value[0]);
    this.right = isLeaf ? null : new Node(value[1]);
  }
  reset() {
    this.isLeaf = true;
    this.value = 0;
    this.left = null;
    this.right = null;
  }
  toArray() {
    return this.isLeaf ? this.value : [this.left.toArray(), this.right.toArray()];
  }
  magnitude() {
    return this.isLeaf ? this.value : 3 * this.left.magnitude() + 2 * this.right.magnitude();
  }
  toString() {
    return JSON.stringify(this.toArray());
  }
  add(newValue) {
    this.left = new Node(this.toArray());
    this.right = new Node(newValue);
    this.isLeaf = false;
    this.value = null;
    this.reduce();
  }
  explode() {
    const { nodeToExplode, pathToExplode } = findNextExplode(this, 4, []);
    if (!nodeToExplode) {
      return false;
    }
    pathToExplode.reverse();
  
    const leftOfExplode = findLeftOfExplode(pathToExplode);
    const rightOfExplode = findRightOfExplode(pathToExplode);

    if (leftOfExplode) {
      leftOfExplode.value += nodeToExplode.left.value;
    }
    if (rightOfExplode) {
      rightOfExplode.value += nodeToExplode.right.value;
    }
    nodeToExplode.reset();
    return true;
  }
  split() {
    const nodeToSplit = findNextSplit(this);
    if (!nodeToSplit) {
      return null;
    }
    const { value } = nodeToSplit;
    const splitDown = Math.floor(value / 2);

    nodeToSplit.isLeaf = false;
    nodeToSplit.value = null;
    nodeToSplit.left = new Node(splitDown);
    nodeToSplit.right = new Node(value - splitDown);
    return true;
  }
  reduce(withLogs=false) {
    while (true) {
      if (withLogs) {
        console.log(this.toString());
      }
      if (this.explode()) continue;
      if (this.split()) continue;
      break;
    }
  }
}

function findNextExplode(subtree, depth, pathToExplode) {
  if (depth <= 0) {
    if (!subtree || (subtree.left.isLeaf && subtree.right.isLeaf)) {
      return { nodeToExplode: subtree, pathToExplode };
    }
  }

  let nextExplode = { nodeToExplode: null, pathToExplode: [] };

  for (const direction of ['left', 'right']) {
    if (!nextExplode.nodeToExplode && !subtree[direction].isLeaf) {
      nextExplode = findNextExplode(
        subtree[direction],
        depth - 1,
        pathToExplode.concat({ node: subtree, direction })
      );
    }
  }

  return nextExplode;
}

function findLeftOfExplode(pathToExplode) {
  if (pathToExplode.length === 0) {
    return null;
  }
  const { node, direction } = pathToExplode[0];
  if (direction === 'right') {
    let nextNode = node.left;
    while (!nextNode.isLeaf) {
      nextNode = nextNode.right;
    }
    return nextNode;
  }
  return findLeftOfExplode(pathToExplode.slice(1));
}

function findRightOfExplode(pathToExplode) {
  if (pathToExplode.length === 0) {
    return null;
  }
  const { node, direction } = pathToExplode[0];
  if (direction === 'left') {
    let nextNode = node.right;
    while (!nextNode.isLeaf) {
      nextNode = nextNode.left;
    }
    return nextNode;
  }
  return findRightOfExplode(pathToExplode.slice(1));
}

function findNextSplit(subtree) {
  if (subtree.value >= 10) {
    return subtree;
  }
  let nextSplit = null;
  for (const direction of ['left', 'right']) {
    if (!nextSplit && subtree[direction]) {
      nextSplit = findNextSplit(subtree[direction]);
    }
  }
  return nextSplit;
}


// PART 1
let tree;
input.forEach((row, i) => {
  if (i === 0) {
    tree = new Node(JSON.parse(row));
  } else {
    tree.add(JSON.parse(row));
  }
});

console.log(tree.toString());
console.log(tree.magnitude());

// PART 2
let maxMagnitude = 0;
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input.length; j++) {
    if (i !== j) {
      tree = new Node(JSON.parse(input[i]));
      tree.add(JSON.parse(input[j]));
      maxMagnitude = Math.max(maxMagnitude, tree.magnitude());
    }
  }
}

console.log(maxMagnitude);
