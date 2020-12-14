const loadInput = require('../lib/loadInput');

const test = (process.argv[2] === 'test');

// to parse input as numbers, add 'number: true' to arg of loadInput
const actionStrs = loadInput({ test });

// START CODE FOR DAY'S PUZZLES HERE
// Action N means to move north by the given value.
// Action S means to move south by the given value.
// Action E means to move east by the given value.
// Action W means to move west by the given value.
// Action L means to turn left the given number of degrees.
// Action R means to turn right the given number of degrees.
// Action F means to move forward by the given value in the direction the ship is currently facing.
const actionRegEx = /([A-Z])(\d+)/;
const deg2rad = (deg) => deg * Math.PI / 180;

const initialOrientation = 0;
const initialPosition = { x: 0, y: 0 };

const getManhattanDistance = (pos1, pos2) => Math.round(Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y));

// part 1
let orientation = initialOrientation;
let position = { ...initialPosition };

actionStrs.forEach((actionStr) => {
    const [_, action, valueStr] = actionStr.match(actionRegEx);
    const value = parseInt(valueStr, 10);
    switch (action) {
        case 'N':
            position.y += value;
            break;
        case 'S':
            position.y -= value;
            break;
        case 'E':
            position.x += value;
            break;
        case 'W':
            position.x -= value;
            break;
        case 'L':
            orientation += deg2rad(value);
            break;
        case 'R':
            orientation -= deg2rad(value);
            break;
        case 'F':
            position.x += value * Math.cos(orientation);
            position.y += value * Math.sin(orientation);
            break;
        default:
            throw Error('invalid action');
    }
    if (test) console.dir({ action, value, orientation, position });
});

console.log(getManhattanDistance(position, initialPosition));


// part 2
position = { ...initialPosition };
let waypoint = { x: 10, y: 1 };

actionStrs.forEach((actionStr) => {
    const [_, action, valueStr] = actionStr.match(actionRegEx);
    const value = parseInt(valueStr, 10);
    switch (action) {
        case 'N':
            waypoint.y += value;
            break;
        case 'S':
            waypoint.y -= value;
            break;
        case 'E':
            waypoint.x += value;
            break;
        case 'W':
            waypoint.x -= value;
            break;
        case 'L':
        case 'R':
            const theta = deg2rad(value) * (action === 'R' ? (-1) : 1);
            const { x, y } = waypoint;
            waypoint.x = x * Math.cos(theta) - y * Math.sin(theta);
            waypoint.y = x * Math.sin(theta) + y * Math.cos(theta);
            break;
        case 'F':
            position.x += value * waypoint.x;
            position.y += value * waypoint.y;
            break;
        default:
            throw Error('invalid action');
    }
    if (test) console.dir({ action, value, position, waypoint });
});

console.log(getManhattanDistance(position, initialPosition));
