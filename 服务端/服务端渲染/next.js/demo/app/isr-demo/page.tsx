import type { Metadata } from 'next';
import { getCurrentTime } from '@/lib/api';

// ISR（增量静态再生）
// 页面在构建时静态生成，之后按 revalidate 设定的周期过期再生
// 这里设为 10 秒，方便刷新页面直接观察到再生效果
export const revalidate = 10; // 每 10 秒重新验证一次

export const metadata: Metadata = {
    title: 'ISR Demo - Next.js Day 3',
    description: '演示 Next.js 的 ISR（增量静态再生）',
};

export default async function ISRDemoPage() {
    const currentTime = await getCurrentTime();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">
                ISR 演示页
            </h1>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-800">
                    渲染模式：ISR（增量静态再生）
                </h2>
                <div className="space-y-3 text-gray-700">
                    <p>
                        <strong>工作原理：</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>页面在构建时静态生成（和 SSG 一样）</li>
                        <li>
                            缓存超过 revalidate 周期（本 demo 为 10
                            秒）后，下一个请求会在后台触发再生
                        </li>
                        <li>再生期间用户看到的仍是旧缓存，无感知</li>
                        <li>再生完成后，后续请求拿到新版本</li>
                    </ul>
                    <p className="mt-4">
                        <strong>适用场景：</strong>
                        内容偶尔更新但不要求实时的页面（如博客文章、商品列表）
                    </p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    当前服务器时间
                </h3>
                <p className="text-2xl font-mono text-blue-600 mb-4">
                    {new Date(currentTime).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                    这个时间戳在服务端生成。10 秒内刷新页面，时间戳不变（命中缓存）；
                    超过 10 秒后的第一次刷新会触发后台再生，再刷新一次即可看到新时间戳。
                </p>
            </div>

            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    动手试一试：
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>记下上方的时间戳</li>
                    <li>连续刷新几次 —— 时间戳保持不变（缓存命中）</li>
                    <li>
                        等 10 秒以上再刷新 —— 这一次可能还是旧时间戳
                        （stale-while-revalidate，再生在后台进行）
                    </li>
                    <li>再刷新一次 —— 看到新的时间戳</li>
                </ol>
            </div>
        </div>
    );
}
