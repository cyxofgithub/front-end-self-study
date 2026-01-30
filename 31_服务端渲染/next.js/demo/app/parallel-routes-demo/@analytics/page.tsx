/**
 * Analytics Slot - Parallel Route
 *
 * This is the @analytics slot content that gets rendered in the parallel routes layout.
 * It's loaded independently and can have its own loading and error states.
 */
export default function AnalyticsSlot() {
    const stats = [
        { label: 'Page Views', value: '12,345', change: '+12%' },
        { label: 'Unique Visitors', value: '8,901', change: '+8%' },
        { label: 'Bounce Rate', value: '32%', change: '-5%' },
        { label: 'Avg. Session', value: '4m 32s', change: '+15%' },
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
                This analytics section is loaded as a parallel route slot.
            </p>
        </div>
    );
}
