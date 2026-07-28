function transNum(n) {
    const s = `${n}`;
    const arr = s.split('.');

    let l = '';
    const r = arr[1] ? `.${arr[1]}` : '';

    let cur = arr[0];
    while (cur) {
        const temp = cur % 1000;
        cur = Math.floor(cur / 1000);
        l = (cur ? ',' : '') + temp + l;
    }

    return l + r;
}

console.log(transNum(87612312352.1234));
