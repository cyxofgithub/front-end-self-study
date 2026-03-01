function generateArr(maxSize, maxValue) {
    const length = Math.round(Math.random() * maxSize);
    const arr = new Array(length);

    for (let i = 0; i < length; i++) {
        arr[i] = Math.round(Math.random() * maxValue);
    }

    return arr;
}

module.exports = generateArr;
