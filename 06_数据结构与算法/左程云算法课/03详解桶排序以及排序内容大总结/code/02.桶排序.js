// 桶排序
// 思想：先排好个位数、十位数直至到数字最长的数字

// 普通桶排序
function bucketSort(arr) {
    const getSortNum = (arr) => {
        let ans = 0;
        for (let i = 0; i < arr.length; i++) {
            let num = arr[i];
            let count = 0;

            while (num) {
                num = Math.floor(num / 10);
                count++;
            }
            ans = Math.max(ans, count);
        }
        return ans;
    };
    const getDigitAtPosition = (num, position) => {
        const digit = Math.floor(num / 10 ** position) % 10;
        return digit;
    };
    const sortNum = getSortNum(arr); // 要桶排序的次数

    for (let i = 0; i < sortNum; i++) {
        const buckets = Array.from({ length: 10 }, () => []);

        for (let j = 0; j < arr.length; j++) {
            const place = getDigitAtPosition(arr[j], i);
            buckets[place].push(arr[j]);
        }
        arr = buckets.flat();
    }

    console.log('arr--', arr);
}
bucketSort([1000, 200, 10, 1, 201, 98, 10000]);

// 某个范围桶排序
function bucketSortInRange(arr, L, R) {
    const getSortNum = (arr, L, R) => {
        let ans = 0;
        for (let i = L; i <= R; i++) {
            let num = arr[i];
            let count = 0;

            while (num) {
                num = Math.floor(num / 10);
                count++;
            }
            ans = Math.max(ans, count);
        }
        return ans;
    };

    const getDigitAtPosition = (num, position) => {
        const digit = Math.floor(num / 10 ** position) % 10;
        return digit;
    };

    const sortNum = getSortNum(arr, L, R);

    for (let i = 0; i < sortNum; i++) {
        const buckets = Array.from({ length: 10 }, () => []);

        for (let j = L; j <= R; j++) {
            const place = getDigitAtPosition(arr[j], i);
            buckets[place].push(arr[j]);
        }
        arr = [...arr.slice(0, L), ...buckets.flat(), ...arr.slice(R)];
    }

    console.log('arr--', arr);
}
bucketSortInRange([1000, 200, 10, 1, 201, 98, 10000], 2, 5);

// 堆空间开辟优化
function perfectBucketSortInRange(arr, L, R) {
    const getSortNum = (arr, L, R) => {
        let ans = 0;
        for (let i = L; i <= R; i++) {
            let num = arr[i];
            let count = 0;

            while (num) {
                num = Math.floor(num / 10);
                count++;
            }
            ans = Math.max(ans, count);
        }
        return ans;
    };

    const getDigitAtPosition = (num, position) => {
        const digit = Math.floor(num / 10 ** position) % 10;
        return digit;
    };

    const sortNum = getSortNum(arr, L, R);
    const buckets = new Array(R - L + 1);

    for (let i = 0; i < sortNum; i++) {
        const counts = Array.from({ length: 10 }, () => 0);

        for (let j = L; j <= R; j++) {
            const place = getDigitAtPosition(arr[j], i);
            counts[place]++;
        }

        for (let i = 1; i < 10; i++) {
            counts[i] += counts[i - 1];
        }

        for (let j = R; j >= L; j--) {
            const place = getDigitAtPosition(arr[j], i);
            buckets[counts[place] - 1] = arr[j];
            counts[place]--;
        }

        for (let i = 0; i < buckets.length; i++) {
            arr[L + i] = buckets[i];
        }
    }

    console.log('arr--', arr);
}
perfectBucketSortInRange([1000, 200, 10, 1, 201, 98, 10000], 2, 5);
