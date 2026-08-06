/**
 * Analytics 插槽 - Parallel Route
 *
 * 这是 @analytics 插槽的内容，会被渲染到 Parallel Routes 布局中。
 * 它独立加载，可以拥有自己的 loading 和 error 状态。
 */
export default function AnalyticsSlot() {
    const stats = [
        { label: '页面浏览量', value: '12,345', change: '+12%' },
        { label: '独立访客', value: '8,901', change: '+8%' },
        { label: '跳出率', value: '32%', change: '-5%' },
        { label: '平均会话时长', value: '4分32秒', change: '+15%' },
    ];

    return (
        <div>
            <div className="space-y-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {stat.value}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-semibold text-green-600">
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">
                本 analytics 区块是通过 Parallel Route 插槽加载的。
            </p>
        </div>
    );
}
