/**
 * Dashboard Slot - Parallel Route
 *
 * This is the @dashboard slot content that gets rendered in the parallel routes layout.
 * It's loaded independently and can have its own loading and error states.
 */
export default function DashboardSlot() {
    const tasks = [
        { id: 1, title: 'Review pull requests', status: 'pending' },
        { id: 2, title: 'Update documentation', status: 'in-progress' },
        { id: 3, title: 'Deploy to staging', status: 'completed' },
        { id: 4, title: 'Team meeting', status: 'pending' },
    ];

    return (
        <div>
            <div className="space-y-3">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`p-3 rounded-lg border-l-4 ${
                            task.status === 'completed'
                                ? 'bg-green-50 border-green-500'
                                : task.status === 'in-progress'
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
                                    task.status === 'completed'
                                        ? 'bg-green-200 text-green-800'
                                        : task.status === 'in-progress'
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
                This dashboard section is loaded as a parallel route slot.
            </p>
        </div>
    );
}
