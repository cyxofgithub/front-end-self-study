# 第5章 哈希表

## 5.1 哈希表的基础知识

```
哈希表是一种常见的数据结构，在解决算法面试题的时候经常需要用到哈希表。哈希表最大的优点是高效，在哈希表中插入、删除或查找一个元素都只需要O（1）的时间。因此，哈希表经常被用来优化时间效率。
```



```
在Java中，哈希表有两个对应的类型，即HashSet和HashMap。如果每个元素都只有一个值，则用HashSet；如果每个元素都存在一个值到另一个值的映射，那么就用HashMap。
```

**HashSet 的常用函数**

![image-20220320131406453](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20220320131406453.png)

**HashMap 的常用函数**

![image-20220320131504050](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20220320131504050.png)

## 5.2 哈希表的设计

```
设计哈希表的前提是待存入的元素需要一个能计算自己哈希值的函数。哈希表根据每个元素的哈希值把它存储到合适的位置。
哈希表最重要的特点就是高效，只需要O（1）的时间就可以把一个元素存入或读出。

计哈希表有3个要点。
	为了快速确定一个元素在哈希表中的位置，可以使用一个数组，元素的位置为它的哈希值除以数组长度的余数。
	由于多个哈希值不同的元素可能会被存入同一位置，数组的每个位置都对应一个链表，因此存入同一位置的多个元素都被添加到同一链表中。
	为了确保链表不会太长，就需要计算哈希表中元素的数目与数组长度的比值。当这个比值超过某个阈值时，就对数组进行扩容并把哈希表中的所有元素重新分配位置
```

### 面试题30：设计插入、删除和随机访问都是O（1）的容器

```js
// 设计插入、删除和随机访问都是O（1）的容器
class hashMap {
    constructor() {
        this.map = []
        this.array = []
    }

    insert(val) {
        this.map.push( [ val, this.array.length ] )
        this.array.push( val )
    }

    delete() {
        console.log('isdelete');
    }

    getRandom() {
        console.log('getRandom');
    }
}

const map = new hashMap()

console.log(map);
```

### 面试题31：最近最少使用缓存

![image-20220320134557725](C:\Users\hp\AppData\Roaming\Typora\typora-user-images\image-20220320134557725.png)

```js
// 面试题31：最近最少使用缓存

// 记录缓存大小
// 利用双链表增删时间复杂度低

class ListNode {
    constructor(key, val) {
        this.key = key
        this.val = val
        this.pre = null
        this.next = null
    }
}

class LRU {
    constructor(capacity) {
        // 存放缓存的大小
        this.capacity = capacity

        // 初始化 map 用于设置 key 和 node 的映射
        this.map = new Map()

        // 初始化头尾节点
        this.head = new ListNode('start' , 'start')
        this.tail = new ListNode('end' , 'end')

        // 初始化双指针
        this.head.pre = this.tail
        this.head.next = this.tail
        this.tail.pre = this.head
        this.tail.next = this.head
    }

    get(key) {
        const node = this.map.get(key)

        if (node) return node.val;
        return -1;
    }

    put(key, val) {
        let node = this.map.get(key)

        // 如果是已经存在的key就修改val
        if (node) {
            node.val = val
            return
        }

        // 如果是不存在的就设置新的值
        node = new ListNode(key, val)
        this.map.set(key, node)
        this.insertTail(node)

         // 判断是否容量已满
         if (this.map.size > this.capacity) {
            this.map.delete(this.head.key)
            this.deleteHead()
        }
    }

    // 当缓存容量已经满的时候头节点
    deleteHead() {
        const next = this.head.next
        this.tail.next = next
        next.pre = this.tail
        this.head = next
    }

    // 插入尾巴
    insertTail(insertNode) {
        if (this.head.key === 'start') {
            insertNode.pre = this.head.pre
            insertNode.next = this.head.next

            // 这里应该考虑优化
            this.head = insertNode
            this.tail.pre = this.head
            this.tail.next = this.head
        } else if (this.tail.key === 'end') {
            insertNode.pre = this.tail.pre
            insertNode.next = this.tail.next

            // 这里应该考虑优化
            this.tail = insertNode
            this.head.next = this.tail
            this.head.pre = this.tail
        } else {
            this.tail.next = insertNode
            insertNode.pre = this.tail
            insertNode.next = this.tail.next
            this.tail = insertNode
        }
    }
}

const lru = new LRU(3)
lru.put('a', 1)
lru.put('b', 2)
lru.put('c', 3)
lru.put('d', 4)
lru.put('f', 5)

console.log(lru.get('b'));
```

## 5.3 哈希表的应用



## 5.4 本章小结

