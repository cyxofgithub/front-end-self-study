class BatchRequest {
    /**
     * @param {number} limit 最大并发数
     * @param {Array<() => Promise<any>>} taskList 任务必须是返回Promise的函数
     */
    constructor(limit = 10, taskList = []) {
        this.limit = limit;
        // 绑定原始下标，保证结果和入参顺序一致
        this.taskQueue = taskList.map((task, index) => ({ task, index }));
        this.result = [];
    }

    // 单条调度流水线：串行不停取队列任务执行
    async _worker() {
        // 队列有任务就一直执行
        while (this.taskQueue.length > 0) {
            const item = this.taskQueue.shift();
            try {
                const res = await item.task();
                this.result[item.index] = res;
            } catch (err) {
                this.result[item.index] = err;
            }
        }
    }

    // 执行入口，返回Promise可await
    exec() {
        // 创建limit个worker并发工作
        const workerNum = Math.min(this.limit, this.taskQueue.length);
        const workers = Array(workerNum)
            .fill(null)
            .map(() => this._worker());
        // 等待所有worker全部空闲，直接返回结果
        return Promise.all(workers).then(() => this.result);
    }
}
