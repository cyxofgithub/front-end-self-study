export interface MetricSummary {
    count: number;
    min: number;
    max: number;
    avg: number;
    p50: number;
    p95: number;
}

function percentile(sortedValues: number[], ratio: number): number {
    if (sortedValues.length === 0) {
        return 0;
    }
    const rawIndex = (sortedValues.length - 1) * ratio;
    const lowIndex = Math.floor(rawIndex);
    const highIndex = Math.ceil(rawIndex);
    if (lowIndex === highIndex) {
        return sortedValues[lowIndex];
    }
    const weight = rawIndex - lowIndex;
    return sortedValues[lowIndex] * (1 - weight) + sortedValues[highIndex] * weight;
}

export class PerfTracker {
    private readonly sampleLimit: number;
    private readonly metrics = new Map<string, number[]>();

    constructor(sampleLimit = 200) {
        this.sampleLimit = sampleLimit;
    }

    record(name: string, value: number): MetricSummary {
        const list = this.metrics.get(name) ?? [];
        list.push(value);
        if (list.length > this.sampleLimit) {
            list.shift();
        }
        this.metrics.set(name, list);
        return this.summarizeList(list);
    }

    getSummary(name: string): MetricSummary | null {
        const list = this.metrics.get(name);
        if (!list || list.length === 0) {
            return null;
        }
        return this.summarizeList(list);
    }

    shouldReport(name: string, every = 20): boolean {
        const list = this.metrics.get(name);
        if (!list || list.length === 0) {
            return false;
        }
        return list.length % every === 0;
    }

    getSnapshot(): Record<string, MetricSummary> {
        const snapshot: Record<string, MetricSummary> = {};
        this.metrics.forEach((list, key) => {
            if (list.length > 0) {
                snapshot[key] = this.summarizeList(list);
            }
        });
        return snapshot;
    }

    private summarizeList(list: number[]): MetricSummary {
        const sorted = [...list].sort((a, b) => a - b);
        const sum = list.reduce((acc, value) => acc + value, 0);
        return {
            count: list.length,
            min: sorted[0],
            max: sorted[sorted.length - 1],
            avg: sum / list.length,
            p50: percentile(sorted, 0.5),
            p95: percentile(sorted, 0.95),
        };
    }
}
