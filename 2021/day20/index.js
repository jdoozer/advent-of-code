const loadInput = require('../../lib/loadInput');
const printMatrix = require('../../lib/printMatrix');

const test = (process.argv[2] === 'test');
const andy = (process.argv[2] === 'andy');

const filename = (andy && !test) ? 'input_andy.txt' : undefined;
const input = loadInput({ test, delimiter: '\n\n', filename });

// helpers for both parts
function stringToBinaryArray(str) {
  return str.split('').map(char => (char === '#' ? 1 : 0));
}

const algorithm = stringToBinaryArray(input[0]);

const image = input[1].split('\n').map(row => stringToBinaryArray(row));

function addBorder(image, borderPixel) {
  const numRows = image.length;
  const numColumns = image[0].length;
  return new Array(numRows + 4).fill(null).map((_, rowIndex) => {
    if (rowIndex < 2 || rowIndex >= numRows + 2) {
      return new Array(numColumns + 4).fill(borderPixel);
    }
    return [borderPixel, borderPixel, ...image[rowIndex - 2], borderPixel, borderPixel];
  });
}

function enhance(inputImage, borderPixel) {
  const imageWithBorder = addBorder(inputImage, borderPixel);
  const numRows = imageWithBorder.length;
  const numColumns = imageWithBorder[0].length;

  let image = imageWithBorder.map(row => ([...row]));

  const nextBorderPixelIndex = borderPixel ? algorithm.length - 1 : 0;

  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    for (let colIndex = 0; colIndex < numColumns; colIndex++) {
      let enhancedPixelIndex;
      if (rowIndex === 0 || colIndex === 0 || rowIndex === numRows - 1 || colIndex === numColumns - 1) {
        enhancedPixelIndex = nextBorderPixelIndex;
      } else {
        const binaryStr = imageWithBorder.slice(rowIndex - 1, rowIndex + 2).map(row => row.slice(colIndex - 1, colIndex + 2).join('')).join('');
        enhancedPixelIndex = parseInt(binaryStr, 2);
      }

      image[rowIndex][colIndex] = algorithm[enhancedPixelIndex];
    }
  }

  return image;
}

function enhanceNTimes(inputImage, n) {
  let image = inputImage;
  let borderPixel = 0;
  for (let i = 0; i < n; i++) {
    image = enhance(image, borderPixel);
    borderPixel = image[0][0];
  }
  return image;
}

function getNumLitPixels(image) {
  return image.reduce((sum, row) => sum + row.reduce((rowSum, value) => value + rowSum), 0);
}

// PART 1
const enhancedImage = enhanceNTimes(image, 2);

if (test) printMatrix(enhancedImage);

console.log('number of pixels lit:', getNumLitPixels(enhancedImage));

// PART 2
const veryEnhancedImage = enhanceNTimes(image, 50);
console.log('number of pixels lit:', getNumLitPixels(veryEnhancedImage));
