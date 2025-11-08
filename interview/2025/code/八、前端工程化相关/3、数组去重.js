function repeatArr(arr) {
    return [...new Set(arr)];
}

function repeatArr2(arr) {
    const res = [];

    for (const item of arr) {
        if (!res.includes(item)) {
            res.push(item);
        }
    }

    return res;
}

console.log(repeatArr([1, 2, 3, 4, 5, 1]));
