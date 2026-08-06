/**
 * Dashboard 插槽 - Parallel Route
 *
 * 这是 @dashboard 插槽的内容，会被渲染到 Parallel Routes 布局中。
 * 它独立加载，可以拥有自己的 loading 和 error 状态。
 */
export default function DashboardSlot() {
    const tasks = [
        { id: 1, title: '审查 pull requests', status: '待处理' },
        { id: 2, title: '更新文档', status: '进行中' },
        { id: 3, title: '部署到预发布环境', status: '已完成' },
        { id: 4, title: '团队会议', status: '待处理' },
    ];

    return (
        <div>
            <div className="space-y-3">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`p-3 rounded-lg border-l-4 ${
                            task.status === '已完成'
                                ? 'bg-green-50 border-green-500'
                                : task.status === '进行中'
                                ? 'bg-yellow-50 border-yellow-500'
                                : 'bg-gray-50 border-gray-300'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-800">
                                {task.title}
                            </span>
                            <span
                                className={`text-xs px-2 py-1 rounded ${
                                    task.status === '已完成'
                                        ? 'bg-green-200 text-green-800'
                                        : task.status === '进行中'
                                        ? 'bg-yellow-200 text-yellow-800'
                                        : 'bg-gray-200 text-gray-800'
                                }`}
                            >
                                {task.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">
                本 dashboard 区块是通过 Parallel Route 插槽加载的。
            </p>
        </div>
    );
}
