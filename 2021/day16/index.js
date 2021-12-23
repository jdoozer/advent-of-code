const loadInput = require('../../lib/loadInput');

const test = (process.argv[2] === 'test');

// const testStr = 'D2FE28';
// const testStr = '38006F45291200';
// const testStr = 'EE00D40C823060';
// const testStr = '8A004A801A8002F478'; // 16
// const testStr = '620080001611562C8802118E34'; // 12
// const testStr = '00001611562C8802118E34';
// const testStr = 'C0015000016115A2E0802F182340'; // 23
// const testStr = 'A0016C880162017C3686B18A3D4780'; // 31

// const testStr = '04005AC33890'; // finds the product of 6 and 9, resulting in the value 54.
// const testStr = 'C200B40A82'; // finds the sum of 1 and 2, resulting in the value 3.
// const testStr = '880086C3E88112'; // finds the minimum of 7, 8, and 9, resulting in the value 7.
// const testStr = 'CE00C43D881120'; // finds the maximum of 7, 8, and 9, resulting in the value 9.
// const testStr = 'D8005AC2A8F0'; // produces 1, because 5 is less than 15.
// const testStr = 'F600BC2D8F'; // produces 0, because 5 is not greater than 15.
// const testStr = '9C005AC2F8F0'; // produces 0, because 5 is not equal to 15.
const testStr = '9C0141080250320F1802104A08'; // produces 1, because 1 + 3 = 2 * 2.


const input = test ? testStr : loadInput({})[0];

// helpers for both parts
const hexToBinary = hex => parseInt(hex, 16).toString(2).padStart(4, '0');

const binary = input.split('').map(char => hexToBinary(char)).join('');

function parseLiteralValue(val) {
  let segment = val.slice(0,5);
  let remaining = val.slice(5);
  let output = segment.slice(1);

  while (segment[0] === '1') {
    segment = remaining.slice(0,5);
    remaining = remaining.slice(5);
    output += segment.slice(1);
  }

  return {
    value: parseInt(output, 2),
    literalValLength: output.length * 5/4,
  };
}

function parsePacket(packet) {
  let subpackets = null;
  let value = null;
  let lengthTypeId = null;

  const version = parseInt(packet.slice(0,3), 2);
  const typeId = parseInt(packet.slice(3,6), 2);
  let parsedLength = 6;

  let typeIdStr = '';

  if (typeId === 4) {
    const parsedLiteral = parseLiteralValue(packet.slice(6));
    parsedLength += parsedLiteral.literalValLength;
    value = parsedLiteral.value;
  } else {
    const lengthTypeId = packet.slice(6,7);
    parsedLength += 1;
    subpackets = [];

    if (lengthTypeId === '0') {
      const subpacketLength = parseInt(packet.slice(7,22), 2);
      let subpacketsToParse = packet.slice(22,22+subpacketLength);

      while (subpacketsToParse !== '') {
        const nextPacket = parsePacket(subpacketsToParse);
        subpackets.push(nextPacket);
        subpacketsToParse = subpacketsToParse.slice(nextPacket.length);
      }
      parsedLength += 15 + subpacketLength;
    } else if (lengthTypeId === '1') {
      const subpacketCount = parseInt(packet.slice(7,18), 2);
      let subpacketsToParse = packet.slice(18);
      parsedLength += 11;

      for (let i = 0; i < subpacketCount; i++) {
        const nextPacket = parsePacket(subpacketsToParse);
        subpackets.push(nextPacket);
        parsedLength += nextPacket.length;
        subpacketsToParse = subpacketsToParse.slice(nextPacket.length);
      }
    }

    switch (typeId) {
      case 0:
        typeIdStr = 'sum';
        const getValueSum = ({ subpackets, value }) => (
          (value !== null)
            ? value
            : subpackets.reduce((sum, packet) => sum + getValueSum(packet), 0)
        );
        value = getValueSum({ subpackets, value });
        break;
      case 1:
        typeIdStr = 'product';
        const getValueProduct = ({ subpackets, value }) => (
          (value !== null)
            ? value
            : subpackets.reduce((prod, packet) => prod * getValueProduct(packet), 1)
        );
        value = getValueProduct({ subpackets, value });
        break;
      case 2:
        typeIdStr = 'min';
        const getMin = ({ subpackets, value }) => (
          (value !== null)
            ? value
            : subpackets.reduce((min, packet) => Math.min(min, getMin(packet)), Infinity)
        );
        value = getMin({ subpackets, value });
        break;
      case 3:
        typeIdStr = 'max';
        const getMax = ({ subpackets, value }) => (
          (value !== null)
            ? value
            : subpackets.reduce((min, packet) => Math.max(min, getMax(packet)), -1)
        );
        value = getMax({ subpackets, value });
        break;
      case 5:
        typeIdStr = 'greater than';
        value = (subpackets[0].value > subpackets[1].value) ? 1 : 0;
        break;
      case 6:
        typeIdStr = 'less than';
        value = (subpackets[0].value < subpackets[1].value) ? 1 : 0;
        break;
      case 7:
        typeIdStr = 'equals';
        value = (subpackets[0].value === subpackets[1].value) ? 1 : 0;
        break;
    }
  }
  
  return {
    ...(test ? { input: packet } : {}),
    version,
    length: parsedLength,
    ...(typeIdStr && test ? { typeIdStr } : {}),
    ...(value !== null ? { value } : {}),
    ...(lengthTypeId !== null ? { lengthTypeId } : {}),
    ...(subpackets ? { subpackets } : {}),
  };
}

const parsed = parsePacket(binary);
console.dir(parsed, { color: true, depth: test ? null : 1 })

// PART 1
const getVersionSum = ({ version, subpackets }) => version + (
  subpackets ? subpackets.reduce((sum, packet) => sum + getVersionSum(packet), 0) : 0
);

console.log(getVersionSum(parsed));

// PART 2
console.log(parsed.value);
