const getOverlapType = (blockLimits, overlapLimits) => {
if (overlapLimits[0] <= blockLimits[0]) {
    return overlapLimits[1] >= blockLimits[1] ? 'outside' : 'start';
}
return overlapLimits[1] >= blockLimits[1] ? 'end' : 'inside';
}


console.log(getOverlapType([0, 10], [0, 10])); // outside
console.log(getOverlapType([0, 10], [-5, 10])); // outside
console.log(getOverlapType([0, 10], [0, 15])); // outside
console.log(getOverlapType([0, 10], [-5, 15])); // outside

console.log(getOverlapType([0, 10], [-4, 9])); // start
console.log(getOverlapType([0, 10], [0, 9])); // start

console.log(getOverlapType([0, 10], [2, 12])); // end
console.log(getOverlapType([0, 10], [2, 10])); // end

console.log(getOverlapType([0, 10], [1, 9])); // inside
