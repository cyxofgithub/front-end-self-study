import type { ReactiveEffect } from './effect';

const queue: Set<ReactiveEffect> = new Set();
// isFlushPending：同步多次修改数据，只会注册一次微任务
// isFlushing：正在刷新期间产生的更新，只入队、禁止新建微任务，剩余任务在当前微任务内递归消化
let isFlushPending = false;
let isFlushing = false;

export const nextTick = (fn?: () => void): Promise<void> =>
    Promise.resolve().then(fn);

export const queueJob = (job: ReactiveEffect): void => {
    queue.add(job);
    if (!isFlushPending && !isFlushing) {
        isFlushPending = true;
        nextTick(flushJobs);
    }
};

function flushJobs() {
    isFlushPending = false;
    isFlushing = true;

    // 关键：先拷贝队列，立刻清空原队列，执行中新任务会留在原queue不会被清空
    const runJobs = [...queue];
    queue.clear();

    // 执行本次批次所有任务
    runJobs.forEach((job) => job.run?.());

    isFlushing = false;
    // 如果本轮执行产生了新任务，直接递归执行，复用当前微任务，不开新微任务
    if (queue.size > 0) {
        flushJobs();
    }
}
