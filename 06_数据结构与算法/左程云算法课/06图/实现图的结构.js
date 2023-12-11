class Grap {
    constructor() {
        this.nodes = new Map(); // 旧的节点表达和转换后的节点表达的映射
        this.edges = new Set(); // 边有哪些
    }
}

class Node {
    constructor(val) {
        this.val = val;
        this.in = 0; // 入度
        this.out = 0; // 出度
        this.nexts = []; // 后续的点
        this.edges = []; // 后续的边
    }
}

class Edges {
    constructor(weight, from, to) {
        this.weight = weight; // 权重
        this.from = from; // 起始点
        this.to = to; // 结束点
    }
}

module.exports = {
    Grap,
    Node,
    Edges,
};
// todo，将二维矩阵表达的图转换为上面的样子
