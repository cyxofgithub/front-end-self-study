class RandomPool {
    constructor() {
        this.keyMapSize = new Map();
        this.sizeMapKey = new Map();
        this.size = 0;
    }

    insert(key) {
        if (!this.keyMapSize.has(key)) {
            this.keyMapSize.set(key, ++this.size);
            this.sizeMapKey.set(this.size, key);
        }
    }

    delete(key) {
        if (this.keyMapSize.has(key)) {
            const curKeySize = this.keyMapSize.get(key);
            const lastKey = this.sizeMapKey.get(this.size);

            this.keyMapSize.delete(key);
            this.size > 1 && this.keyMapSize.set(lastKey, curKeySize);

            this.sizeMapKey.delete(this.size);
            this.size > 1 && this.sizeMapKey.set(curKeySize, lastKey);

            this.size--;
        }
    }

    getRandom() {
        if (this.size < 1) return null;

        const random = Math.random() * this.size;
        const size = Math.floor(random) + 1;

        return this.sizeMapKey.get(size);
    }
}

const pool = new RandomPool();

pool.insert('a');
pool.insert('b');
pool.insert('c');
pool.insert('d');

pool.delete('a');
console.log(pool.getRandom());
