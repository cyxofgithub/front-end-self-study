class Element {
    constructor(value) {
        this.value = value;
    }
}

class UnionFindSet {
    constructor(list) {
        this.elemntMap = new Map();
        this.fatherMap = new Map();
        this.sizeMap = new Map();

        for (const val of list) {
            const element = new Element(val);
            this.elemntMap.set(val, element);
            this.fatherMap.set(element, element);
            this.sizeMap.set(element, 1);
        }
    }

    findHead(element) {
        const path = [];

        while (element !== this.fatherMap.get(element)) {
            path.push(element);
            element = this.fatherMap.get(element);
        }

        // 扁平化指向
        while (path.length) {
            this.fatherMap.set(path.pop(), element);
        }

        return element;
    }

    isSameSet(a, b) {
        if (this.elemntMap.has(a) && this.elemntMap.has(b)) {
            return (
                this.findHead(this.elemntMap.get(a)) ===
                this.findHead(this.elemntMap.get(b))
            );
        }

        return false;
    }

    union(a, b) {
        if (this.elemntMap.has(a) && this.elemntMap.has(b)) {
            const aF = this.findHead(this.elemntMap.get(a));
            const bF = this.findHead(this.elemntMap.get(b));

            if (aF != bF) {
                const big =
                    this.sizeMap.get(aF) >= this.sizeMap.get(bF) ? aF : bF;
                const small = big === aF ? bF : aF;

                this.fatherMap.set(small, big);
                this.sizeMap.set(
                    big,
                    this.sizeMap.get(aF) + this.sizeMap.get(bF)
                );
                this.sizeMap.delete(small);
            }
        }
    }
}
