// 防抖
function debounce(fn, time, immediate = false) {
    let timer = null; // 初始化定时器为null，避免undefined判断问题

    return function(...args) {
        // 保存原函数的this上下文（当前return的函数的this）
        const context = this;
        // 清除上一次的定时器（无论是否立即执行，都需要重置）
        if (timer) clearTimeout(timer);

        if (immediate) {
            // 立即执行：如果没有定时器（首次触发或已完成），则立即执行
            if (!timer) {
                fn.apply(context, args);
            }
            // 设定定时器，到期后重置timer（期间再次触发不会执行）
            timer = setTimeout(() => {
                timer = null;
            }, time);
        } else {
            // 非立即执行：每次触发都延迟执行，覆盖上一次的定时器
            timer = setTimeout(() => {
                fn.apply(context, args);
                timer = null; // 执行后重置
            }, time);
        }
    };
}

//节流
function throttle(fn, delay, options = { leading: true, trailing: true }) {
    let lastTime = 0;
    let timer = null;
    const { leading, trailing } = options;

    const clear = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    return function(...args) {
        const now = Date.now();
        const context = this;

        // 如果是第一次执行且不允许立即执行，初始化lastTime
        if (!lastTime && leading === false) {
            lastTime = now;
        }

        // 计算剩余时间
        const remaining = delay - (now - lastTime);

        // 时间间隔超过延迟，立即执行
        if (remaining <= 0) {
            clear(); // 清除可能存在的定时器
            fn.apply(context, args);
            lastTime = now;
        }
        // 否则如果需要最后一次执行且没有定时器，设置延迟执行
        else if (trailing !== false && !timer) {
            clear(); // 清除可能存在的定时器
            timer = setTimeout(() => {
                fn.apply(context, args);
                lastTime = leading === false ? 0 : Date.now(); // 重置lastTime
                timer = null;
            }, remaining);
        }
    };
}
