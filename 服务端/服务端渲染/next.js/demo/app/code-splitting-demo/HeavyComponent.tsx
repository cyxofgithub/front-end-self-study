'use client';

/**
 * 重组件 - 模拟一个受益于代码分割的大型组件
 * 这类组件通常会显著增加包体积
 */
export default function HeavyComponent() {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-4">重组件已加载！</h3>
            <p className="mb-4">
                该组件通过{' '}
                <code className="bg-white/20 px-2 py-1 rounded">dynamic()</code>
                动态加载。它不包含在初始包中，从而减少了页面加载时间。
            </p>
            <div className="grid grid-cols-3 gap-4 mt-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                        key={item}
                        className="bg-white/20 p-4 rounded text-center"
                    >
                        <div className="text-3xl font-bold">{item}</div>
                        <div className="text-sm opacity-90">功能 {item}</div>
                    </div>
                ))}
            </div>
            <p className="mt-6 text-sm opacity-90">
                打开 Network 标签，可以看到该组件是作为独立的 chunk 加载的！
            </p>
        </div>
    );
}
