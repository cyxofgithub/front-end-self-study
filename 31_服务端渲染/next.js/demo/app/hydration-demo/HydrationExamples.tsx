'use client';

import { useState, useEffect } from 'react';

/**
 * 水合示例组件集合
 * 展示水合（Hydration）的常见错误和正确做法
 */

// 示例1：错误 - 使用 Date.now() 导致服务端和客户端初始渲染不一致
export function WrongTimestampExample() {
    // ❌ 错误：在组件顶层直接调用 Date.now()
    // 服务端渲染时：生成时间戳A，写入HTML
    // 客户端水合时：React重新执行组件，生成时间戳B（时间已过去）
    // React对比发现HTML中的A和虚拟DOM中的B不一致 → 水合错误
    const timestamp = Date.now();

    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
            <h3 className="font-semibold text-red-800 mb-2">
                ❌ 错误示例：直接使用 Date.now()
            </h3>
            <p className="text-sm text-red-700 mb-2">当前时间戳：{timestamp}</p>
            <div className="text-xs text-red-600 space-y-1 mt-2">
                <p>
                    <strong>问题本质：</strong>
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>
                        服务端渲染时，组件执行生成时间戳A，HTML中包含：
                        {timestamp}
                    </li>
                    <li>
                        客户端水合时，React重新执行组件，生成时间戳B（时间已过去）
                    </li>
                    <li>
                        React对比发现HTML（A）和虚拟DOM（B）不一致 → 水合错误
                    </li>
                </ul>
                <p className="mt-2">
                    关键：问题不在于"值不同"本身，而在于
                    <strong>初始渲染不一致</strong>
                </p>
            </div>
        </div>
    );
}

// 示例2：正确 - 使用 useEffect 确保初始渲染一致
export function CorrectTimestampExample() {
    const [timestamp, setTimestamp] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // ✅ 正确：useEffect 只在客户端执行，不影响初始渲染
        setMounted(true);
        setTimestamp(Date.now());
    }, []);

    return (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
            <h3 className="font-semibold text-green-800 mb-2">
                ✅ 正确示例：使用 useEffect
            </h3>
            {!mounted ? (
                <p className="text-sm text-green-700">
                    加载中...（服务端和客户端初始渲染一致）
                </p>
            ) : (
                <p className="text-sm text-green-700">
                    客户端时间戳：{timestamp}
                </p>
            )}
            <div className="text-xs text-green-600 mt-2 space-y-1">
                <p>
                    <strong>解决方案：</strong>
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>服务端和客户端初始都渲染"加载中"（一致）</li>
                    <li>水合完成后，useEffect 执行，更新为实际时间戳</li>
                    <li>这样确保了初始渲染的一致性，避免了水合错误</li>
                </ul>
            </div>
        </div>
    );
}

// 示例3：错误 - 使用 Math.random() 导致初始渲染不一致
export function WrongRandomExample() {
    // ❌ 错误：在组件顶层直接调用 Math.random()
    // 服务端渲染时：生成随机数A，写入HTML
    // 客户端水合时：React重新执行组件，生成随机数B（不同的随机数）
    // React对比发现HTML中的A和虚拟DOM中的B不一致 → 水合错误
    const randomNum = Math.random();

    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
            <h3 className="font-semibold text-red-800 mb-2">
                ❌ 错误示例：直接使用 Math.random()
            </h3>
            <p className="text-sm text-red-700 mb-2">
                随机数：{randomNum.toFixed(4)}
            </p>
            <div className="text-xs text-red-600 space-y-1 mt-2">
                <p>
                    <strong>问题本质：</strong>
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>
                        服务端渲染时，组件执行生成随机数A，HTML中包含：
                        {randomNum.toFixed(4)}
                    </li>
                    <li>
                        客户端水合时，React重新执行组件，生成随机数B（必然不同）
                    </li>
                    <li>
                        React对比发现HTML（A）和虚拟DOM（B）不一致 → 水合错误
                    </li>
                </ul>
                <p className="mt-2">
                    关键：即使随机数本身就应该不同，但在
                    <strong>初始渲染时不一致</strong>就会导致水合错误
                </p>
            </div>
        </div>
    );
}

// 示例4：正确 - 使用 useEffect 确保初始渲染一致
export function CorrectRandomExample() {
    const [randomNum, setRandomNum] = useState<number | null>(null);

    useEffect(() => {
        // ✅ 正确：useEffect 只在客户端执行，不影响初始渲染
        setRandomNum(Math.random());
    }, []);

    return (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
            <h3 className="font-semibold text-green-800 mb-2">
                ✅ 正确示例：使用 useEffect
            </h3>
            {randomNum === null ? (
                <p className="text-sm text-green-700">生成中...</p>
            ) : (
                <p className="text-sm text-green-700">
                    随机数：{randomNum.toFixed(4)}
                </p>
            )}
            <div className="text-xs text-green-600 mt-2 space-y-1">
                <p>
                    <strong>解决方案：</strong>
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>服务端和客户端初始都渲染"生成中"（一致）</li>
                    <li>水合完成后，useEffect 执行，生成并显示随机数</li>
                    <li>这样确保了初始渲染的一致性，避免了水合错误</li>
                </ul>
            </div>
        </div>
    );
}

// 示例5：错误 - 基于 localStorage 的条件渲染导致不一致
export function WrongLocalStorageExample() {
    // ❌ 错误：服务端没有 localStorage，客户端有
    // 服务端渲染时：localStorage 不存在，渲染"未登录"
    // 客户端水合时：localStorage 存在，可能渲染"已登录"
    // React对比发现HTML和虚拟DOM不一致 → 水合错误
    const isLoggedIn =
        typeof window !== 'undefined' && window.localStorage
            ? '已登录'
            : '未登录';

    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
            <h3 className="font-semibold text-red-800 mb-2">
                ❌ 错误示例：基于 localStorage 的条件渲染
            </h3>
            <p className="text-sm text-red-700 mb-2">
                {isLoggedIn ? (
                    <span>状态：已登录</span>
                ) : (
                    <span>状态：未登录</span>
                )}
            </p>
            <div className="text-xs text-red-600 space-y-1 mt-2">
                <p>
                    <strong>问题本质：</strong>
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>服务端渲染时：localStorage 不存在，渲染"未登录"</li>
                    <li>客户端水合时：localStorage 存在，可能渲染"已登录"</li>
                    <li>
                        React对比发现HTML（未登录）和虚拟DOM（已登录）不一致 →
                        水合错误
                    </li>
                </ul>
                <p className="mt-2">
                    关键：即使用了{' '}
                    <code className="bg-red-100 px-1 rounded">
                        typeof window !== 'undefined'
                    </code>{' '}
                    检查，但服务端和客户端的初始渲染结果仍然不同
                </p>
            </div>
        </div>
    );
}

// 示例6：错误 - 直接使用 window 对象
export function WrongWindowExample() {
    // ❌ 错误：服务端没有 window 对象
    // 虽然用了 typeof 检查避免报错，但服务端和客户端渲染结果不同
    const userAgent =
        typeof window !== 'undefined' ? window.navigator.userAgent : '';

    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
            <h3 className="font-semibold text-red-800 mb-2">
                ❌ 错误示例：直接访问 window
            </h3>
            <p className="text-sm text-red-700 mb-2">
                User Agent: {userAgent || '服务端无法获取'}
            </p>
            <div className="text-xs text-red-600 space-y-1 mt-2">
                <p>
                    <strong>问题本质：</strong>
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>服务端渲染时：window 不存在，渲染"服务端无法获取"</li>
                    <li>客户端水合时：window 存在，渲染实际的 User Agent</li>
                    <li>React对比发现HTML和虚拟DOM不一致 → 水合警告</li>
                </ul>
                <p className="mt-2">
                    虽然用了{' '}
                    <code className="bg-red-100 px-1 rounded">
                        typeof window !== 'undefined'
                    </code>{' '}
                    检查避免报错，但服务端和客户端的初始渲染结果仍然不同
                </p>
            </div>
        </div>
    );
}

// 示例7：正确 - 使用 useEffect 处理 localStorage
export function CorrectLocalStorageExample() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        // ✅ 正确：useEffect 只在客户端执行，不影响初始渲染
        const loggedIn = !!localStorage;
        setIsLoggedIn(loggedIn);
    }, []);

    return (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
            <h3 className="font-semibold text-green-800 mb-2">
                ✅ 正确示例：useEffect 处理 localStorage
            </h3>
            {isLoggedIn === null ? (
                <p className="text-sm text-green-700">检查登录状态中...</p>
            ) : (
                <p className="text-sm text-green-700">
                    状态：{isLoggedIn ? '已登录' : '未登录'}
                </p>
            )}
            <div className="text-xs text-green-600 mt-2 space-y-1">
                <p>
                    <strong>解决方案：</strong>
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>服务端和客户端初始都渲染"检查登录状态中..."（一致）</li>
                    <li>
                        水合完成后，useEffect 执行，读取 localStorage 并更新状态
                    </li>
                    <li>这样确保了初始渲染的一致性，避免了水合错误</li>
                </ul>
            </div>
        </div>
    );
}

// 示例8：正确 - 使用 useEffect 访问浏览器 API
export function CorrectWindowExample() {
    const [userAgent, setUserAgent] = useState<string>('');

    useEffect(() => {
        // ✅ 正确：useEffect 只在客户端执行，不影响初始渲染
        setUserAgent(window.navigator.userAgent);
    }, []);

    return (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
            <h3 className="font-semibold text-green-800 mb-2">
                ✅ 正确示例：useEffect 访问 window
            </h3>
            {userAgent ? (
                <p className="text-sm text-green-700 break-all">
                    User Agent: {userAgent}
                </p>
            ) : (
                <p className="text-sm text-green-700">加载中...</p>
            )}
            <div className="text-xs text-green-600 mt-2 space-y-1">
                <p>
                    <strong>解决方案：</strong>
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>服务端和客户端初始都渲染"加载中..."（一致）</li>
                    <li>水合完成后，useEffect 执行，读取 User Agent 并更新</li>
                    <li>这样确保了初始渲染的一致性，避免了水合错误</li>
                </ul>
            </div>
        </div>
    );
}

// 示例9：使用 suppressHydrationWarning 处理已知的不一致
export function SuppressHydrationExample() {
    const [clientTime, setClientTime] = useState<string>('');

    useEffect(() => {
        // 在客户端设置时间
        const updateTime = () => {
            setClientTime(new Date().toLocaleTimeString('zh-CN'));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">
                ✅ suppressHydrationWarning 示例
            </h3>
            <p className="text-sm text-blue-700 mb-2">
                当前时间：
                <span
                    suppressHydrationWarning
                    className="font-mono font-bold ml-2"
                >
                    {clientTime || '加载中...'}
                </span>
            </p>
            <div className="text-xs text-blue-600 mt-2 space-y-1">
                <p>
                    <strong>使用场景：</strong>
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>
                        对于已知的、预期的差异（如时间显示），可以使用{' '}
                        <code className="bg-blue-100 px-1 rounded">
                            suppressHydrationWarning
                        </code>
                    </li>
                    <li>
                        告诉 React
                        这个元素的内容在服务端和客户端可能不同，这是预期的
                    </li>
                    <li>但更好的做法还是使用 useEffect 确保初始渲染一致</li>
                </ul>
            </div>
        </div>
    );
}

// 示例10：展示水合过程的可视化
export function HydrationProcessExample() {
    const [hydrated, setHydrated] = useState(false);
    const [serverRendered, setServerRendered] = useState(true);

    useEffect(() => {
        // 模拟水合过程
        setTimeout(() => {
            setHydrated(true);
            setServerRendered(false);
        }, 1000);
    }, []);

    return (
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded mb-4">
            <h3 className="font-semibold text-purple-800 mb-2">水合过程演示</h3>
            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <div
                        className={`w-3 h-3 rounded-full ${
                            serverRendered ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                    />
                    <span className="text-purple-700">
                        1. 服务端渲染 HTML（已完成）
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className={`w-3 h-3 rounded-full ${
                            hydrated
                                ? 'bg-green-500'
                                : 'bg-yellow-500 animate-pulse'
                        }`}
                    />
                    <span className="text-purple-700">
                        2. 浏览器接收 HTML 并显示
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className={`w-3 h-3 rounded-full ${
                            hydrated ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                    />
                    <span className="text-purple-700">
                        3. React 在客户端"水合"（接管页面）
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className={`w-3 h-3 rounded-full ${
                            hydrated ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                    />
                    <span className="text-purple-700">
                        4. 页面变为可交互状态
                    </span>
                </div>
            </div>
            {hydrated && (
                <p className="text-xs text-green-600 mt-2 font-semibold">
                    ✅ 水合完成！页面现在可以交互了
                </p>
            )}
        </div>
    );
}

// 主组件：展示所有示例
export default function HydrationExamples() {
    return (
        <div className="space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <h3 className="font-semibold text-yellow-800 mb-2">
                    ⚠️ 重要概念
                </h3>
                <div className="text-sm text-yellow-700 space-y-2">
                    <p>
                        <strong>水合错误的本质：</strong>
                    </p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>
                            服务端渲染时，React 组件执行一次，生成
                            HTML（包含值A）
                        </li>
                        <li>
                            客户端水合时，React 重新执行组件，生成虚拟
                            DOM（包含值B）
                        </li>
                        <li>
                            React 对比 HTML 和虚拟 DOM，发现不一致 → 水合错误
                        </li>
                    </ul>
                    <p className="mt-2">
                        <strong>关键点：</strong>
                        问题不在于"值不同"本身（这是正常的），而在于
                        <strong>初始渲染时不一致</strong>
                        。即使值不同是预期的，但在服务端和客户端的首次渲染必须一致。
                    </p>
                    <p className="mt-2 text-xs">
                        下面的错误示例可能会导致控制台出现水合警告。这是正常的，用于演示目的。
                    </p>
                </div>
            </div>

            <div>
                <div className="space-y-4 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                        错误示例（会导致水合警告）
                    </h3>
                    <WrongTimestampExample />
                    <WrongRandomExample />
                    <WrongLocalStorageExample />
                    <WrongWindowExample />
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    正确示例
                </h3>
                <CorrectTimestampExample />
                <CorrectRandomExample />
                <CorrectLocalStorageExample />
                <CorrectWindowExample />
                <SuppressHydrationExample />
            </div>

            <HydrationProcessExample />
        </div>
    );
}
