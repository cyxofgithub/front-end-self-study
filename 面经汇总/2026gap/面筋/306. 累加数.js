var isAdditiveNumber = function (num) {
    const n = num.length;

    const check = (one, two, idx) => {
        one = Number(one);
        two = Number(two);

        while (idx < n) {
            const sumStr = `${one + two}`;
            if (!num.startsWith(sumStr, idx)) return false;
            [one, two] = [two, one + two];
            idx += sumStr.length;
        }

        return true;
    };

    for (let i = 1; i < n; i++) {
        const s1 = num.slice(0, i);
        // 长度大于1才需要限制0
        if (s1.length > 1 && s1[0] === '0') continue;

        for (let j = 1; i + j < n; j++) {
            const s2 = num.slice(i, i + j);
            // 长度大于1才需要限制0
            if (s2.length > 1 && s2[0] === '0') continue;

            if (check(s1, s2, i + j)) return true;
        }
    }

    return false;
};

console.log(isAdditiveNumber('101'));
