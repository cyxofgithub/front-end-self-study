function threeNumCount(arr) {
    const result = [];

    const sortArr = arr.sort((a, b) => a - b);
    const len = sortArr.length;

    for (let i = 0; i < len - 2; i++) {
        // 不能用 if (arr[i] === arr[i + 1]) 代替，否则 [0,0,0]的情况会跳过
        if (i > 0 && arr[i] === arr[i - 1]) continue;

        let left = i + 1;
        let right = len - 1;
        const target = -arr[i];

        while (left < right) {
            const count = arr[left] + arr[right];
            if (count === target) {
                result.push([arr[i], arr[left], arr[right]]);
                left++;
                right--;
                while (left < right && arr[left] === arr[left - 1]) {
                    left++;
                }
                while (left < right && arr[right] === arr[right + 1]) {
                    right--;
                }
            } else if (count < target) {
                left++;
            } else {
                right--;
            }
        }
    }

    console.log(result);
}

threeNumCount([1, 1, 1, -1, 0]);
