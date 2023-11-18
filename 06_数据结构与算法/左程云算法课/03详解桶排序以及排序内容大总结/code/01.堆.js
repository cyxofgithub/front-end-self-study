// 大根堆(父永远比子大)调整还是插入都是 log 级别代价的，主要跟它的高度与关
//   7
//  6   4
// 3 2 3 2
// 以这个大根堆为例子，插入一个数字最多就是调整3次
function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

class Heap {
    arr;

    constructor(arr = []) {
        this.arr = arr;
    }

    // 某个数在index位置，往下继续移动的方法
    heapify(index, heapSize) {
        if (index >= heapSize) {
            return;
        }

        let left = index * 2 + 1;
        let right = index * 2 + 2;
        let largest = index;

        if (left < heapSize && this.arr[left] > this.arr[largest]) {
            largest = left;
        }
        if (right < heapSize && this.arr[right] > this.arr[largest]) {
            largest = right;
        }

        if (index !== largest) {
            swap(this.arr, index, largest);
            this.heapify(largest, heapSize);
        }
    }

    // 某个数在index位置，往上继续移动的方法
    heapInsert(num, index) {
        this.arr.push(num);
        let parentIndex = Math.floor((this.arr.length - 1) / 2);
        let curPlace = this.arr.length - 1;

        while (parentIndex >= 0) {
            if (this.arr[parentIndex] < num) {
                swap(this.arr, parentIndex, curPlace);
                curPlace = parentIndex;
            }
            parentIndex = Math.floor((parentIndex - 1) / 2);
        }
    }

    // 给数组排序
    heapSort(arr) {
        for (let i = 0; i < arr.length; i++) {
            this.heapInsert(arr[i]);
        }

        let heapSize = this.arr.length;
        while (heapSize > 0) {
            swap(this.arr, 0, --heapSize);
            this.heapify(0, heapSize);
        }

        return this.arr;
    }

    // 给数组排序，移动距离不超过 k
    sortArrDistanceLessK(arr, k) {
        for (let i = 0; i < Math.min(arr.length, k + 1); i++) {
            this.heapInsert(arr[i]);
        }

        const ans = [];
        let j = k + 1;
        for (; j < arr.length; j++) {
            ans.unshift(this.arr.shift());
            this.heapify(0, k);
            this.heapInsert(arr[j]);
        }

        while (this.arr.length) {
            ans.unshift(this.arr.shift());
            this.heapify(0, --k);
        }

        return ans;
    }
}

const heap1 = new Heap();

// 测试 heapInsert
heap1.heapInsert(3);
heap1.heapInsert(2);
heap1.heapInsert(4);
heap1.heapInsert(1);
heap1.heapInsert(5);
heap1.heapInsert(7);
heap1.heapInsert(9);
heap1.heapInsert(11);
console.log(heap1.arr);

// 测试 heapSort
const heap2 = new Heap();

console.log(heap2.heapSort([23, 123, 22, 9, 5, 4, 1, 2, 7, 3, 0]));

// 测试数组排序不超过k
const heap3 = new Heap();
console.log(
    heap3.sortArrDistanceLessK([23, 123, 22, 9, 5, 4, 1, 2, 7, 3, 0], 3)
);
