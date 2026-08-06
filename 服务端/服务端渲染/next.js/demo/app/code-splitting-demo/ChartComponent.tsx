'use client';

/**
 * 图表组件 - 模拟图表库组件
 * 这类库通常体积很大，非常适合代码分割
 */
export default function ChartComponent() {
    return (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
                图表组件
            </h3>
            <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-gray-600">
                        图表可视化将显示在这里
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        （这里模拟一个体积较大的图表库组件）
                    </p>
                </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
                像 Chart.js、Recharts 或 D3.js
                这样的图表库是代码分割的完美候选，因为它们只在特定页面才需要。
            </p>
        </div>
    );
}
