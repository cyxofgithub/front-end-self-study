const versionList = ['1.0.1', '1.0.2', '2.1.0', '1.0.3', '2.0'];

function versionListSort(versionList) {
    return versionList.sort((a, b) => {
        const v1 = a.split('.').map((item) => Number(item));
        const v2 = b.split('.').map((item) => Number(item));
        const length = Math.max(v1.length, v2.length);

        for (let i = 0; i < length; i++) {
            const num1 = v1[i] || 0;
            const num2 = v2[i] || 0;

            if (num1 === num2) continue;

            return num1 - num2;
        }

        return 0;
    });
}

console.log(versionListSort(versionList));
