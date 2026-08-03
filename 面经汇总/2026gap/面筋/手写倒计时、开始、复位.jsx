import React, { useRef, useState } from 'react';

const InitTime = 10;
export function App() {
    const [time, setTime] = useState<number>(InitTime);
    const [start, setStart] = useState(false);
    const timer = useRef<any>(null); // 仅把any改成规范类型

    const handleSwitch = () => {
        const nextStart = !start; // ✅ 先拿到新状态，解决闭包旧值问题
        setStart(nextStart);

        if (!time) return;

        if (nextStart) {
            // ✅ 使用nextStart，不再用start
            // ✅ 开启前先清定时器，防止多次点击产生多个计时器
            if (timer.current) clearInterval(timer.current);
            timer.current = setInterval(() => {
                setTime((pre) => {
                    pre === 1 && clearInterval(timer.current!);
                    return pre - 1;
                });
            }, 1000);
        } else {
            timer.current && clearInterval(timer.current);
        }
    };

    const handleRest = () => {
        // ✅ 复位清除定时器
        timer.current && clearInterval(timer.current);
        setStart(false); // ✅ 复位同步停止状态
        setTime(InitTime);
    };

    return (
        <div>
            <div>时间：{time}</div>
            <button onClick={handleSwitch}>{start ? '暂停' : '开始'}</button>
            <button onClick={handleRest}>复位</button>
        </div>
    );
}
