const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');
const input = loadInput({ test });

const commandRegEx = /\$ (?<command>cd|ls)( (?<dir>\S+))?/g;
const lsDirRegEx = /dir (?<dirName>\w+)/g;
const lsFileRegEx = /(?<size>\d+) (?<filename>\S+)/g;

const sizeLimit = 100000;

class Directory {
    constructor(name, parent) {
        this.name = name;
        this.files = [];
        this.subDirs = [];
        this.parent = parent;
    }
    addFile(fileInfo) {
        this.files.push(fileInfo);
    }
    addSubDir(subDirName) {
        this.subDirs.push(new Directory(subDirName, this));
    }
    getSubDir(subDirName) {
        return this.subDirs.find(subDir => subDir.name === subDirName);
    }
    calcSize(dirSizes) {
        if (!this.size) {
            const fileSize = this.files.reduce((sum, file) => sum + file.size, 0);
            const subDirSize = this.subDirs.reduce((sum, dir) => sum + dir.calcSize(dirSizes), 0);
            this.size = fileSize + subDirSize;
            dirSizes.push({ name: this.name, size: this.size });
        }
        return this.size;
    }
}

// PART 1
let fileStructure;
let currentDir = null;
input.forEach(row => {
    const { command, dir } = (new RegExp(commandRegEx)).exec(row)?.groups || {};
    if (command) {
        if (command === 'cd') {
            if (dir === '..') {
                currentDir = currentDir.parent;
            } else if (dir === '/') {
                fileStructure = new Directory(dir, currentDir);
                currentDir = fileStructure;
            } else {
                currentDir = currentDir.getSubDir(dir);
            }
        }
        return;
    }

    const { dirName } = (new RegExp(lsDirRegEx)).exec(row)?.groups || {};
    if (dirName) {
        currentDir.addSubDir(dirName);
        return;
    }

    const { size, filename } = (new RegExp(lsFileRegEx)).exec(row)?.groups || {};
    if (size && filename) {
        currentDir.addFile({ filename, size: +size });
    }
});

const dirSizes = [];
fileStructure.calcSize(dirSizes);

const sumUnderLimit = dirSizes.reduce((sum, { size }) => sum + (size < sizeLimit ? size : 0), 0);
console.log(sumUnderLimit)

// PART 2
const totalDiskSpace = 70000000;
const unusedSpace = 30000000;
const maxUsableSpace = totalDiskSpace - unusedSpace;

const startingSize = fileStructure.size;
const minToClear = startingSize - maxUsableSpace;

const dirToClear = dirSizes.sort((a, b) => a.size - b.size).find(({ size }) => size > minToClear);
console.log(dirToClear);