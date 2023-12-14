class TopologySort {
    exec(graph) {
        // key: 某一个 node
        // value: 剩余的入度
        const inMap = new Map();

        // 入度为0的点，才能进入这个队列
        const zeroInQueue = [];

        for (const node of graph.nodes) {
            inMap.put(node, node.in);

            if (node.in === 0) {
                zeroInQueue.unshift(node);
            }
        }

        // 拓扑排序的结果，依次加入 result
        const result = [];

        while (!zeroInQueue.length) {
            const cur = zeroInQueue.pop();
            result.push(cur);

            for (const next of cur.nexts) {
                inMap.put(next, inMap.get(next) - 1);

                if (inMap.get(next) === 0) {
                    zeroInQueue.push(next);
                }
            }
        }
    }
}
