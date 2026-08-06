import { headers } from 'next/headers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Fetch 缓存对比 - Next.js Demo',
    description:
        '真实可运行地对比 fetch 的三种缓存策略：默认缓存、no-store、next.revalidate',
};

// 服务端 fetch 自己的 API 需要绝对地址
// 从当前请求的 headers 里推导 origin，端口号/部署域名变化都不用改配置
async function getBaseUrl() {
    const headerList = headers();
    const host = headerList.get('host') ?? 'localhost:3000';
    const proto = headerList.get('x-forwarded-proto') ?? 'http';
    return `${proto}://${host}`;
}

async function fetchTime(
    baseUrl: string,
    options?: RequestInit & { next?: { revalidate?: number } }
) {
    const res = await fetch(`${baseUrl}/api/time`, options);
    const data = (await res.json()) as { time: string };
    return new Date(data.time).toLocaleString();
}

/**
 * Fetch 缓存对比演示
 *
 * 三种缓存策略（面试高频）：
 * 1. fetch(url)                              - Next 14 默认缓存（Data Cache）
 * 2. fetch(url, { cache: 'no-store' })       - 不缓存，每次请求都回源（SSR 效果）
 * 3. fetch(url, { next: { revalidate: N } }) - 缓存 N 秒（请求粒度的 ISR）
 *
 * 注意：本页没有用 force-dynamic，而是用 headers() 让路由按请求渲染。
 * 因为 force-dynamic / revalidate = 0 会把本路由所有 fetch 的默认缓存行为
 * 强制改成 no-store，那样三种写法就观察不到差异了。
 */
export default async function FetchCacheDemoPage() {
    // 动态函数：让本页每次请求都重新渲染，但不改变 fetch 的缓存语义
    const baseUrl = await getBaseUrl();

    const [defaultTime, noStoreTime, revalidateTime] = await Promise.all([
        // 1. force-cache：显式缓存，结果存入 Data Cache 跨请求复用
        fetchTime(baseUrl, { cache: 'force-cache' }),
        // 2. no-store：完全不缓存，每次都打到 /api/time
        fetchTime(baseUrl, { cache: 'no-store' }),
        // 3. next.revalidate：缓存 10 秒，过期后下次请求回源
        fetchTime(baseUrl, { next: { revalidate: 10 } }),
    ]);

    const cards = [
        {
            title: "fetch(url, { cache: 'force-cache' })",
            subtitle: '显式缓存（Data Cache）',
            time: defaultTime,
            cardClass: 'bg-green-50 border-green-500',
            subtitleClass: 'text-green-700',
            points: [
                '结果存入 Data Cache，跨请求复用',
                '连续刷新：时间戳长期不变',
                '静态路由中 fetch(url) 不写配置就是这个行为',
            ],
        },
        {
            title: "fetch(url, { cache: 'no-store' })",
            subtitle: '不缓存（SSR 效果）',
            time: noStoreTime,
            cardClass: 'bg-blue-50 border-blue-500',
            subtitleClass: 'text-blue-700',
            points: [
                '每次请求都回源，数据永远最新',
                '连续刷新：时间戳每次都变',
                '动态路由中 fetch(url) 不写配置就是这个行为',
            ],
        },
        {
            title: 'fetch(url, { next: { revalidate: 10 } })',
            subtitle: '缓存 10 秒（请求粒度 ISR）',
            time: revalidateTime,
            cardClass: 'bg-purple-50 border-purple-500',
            subtitleClass: 'text-purple-700',
            points: [
                '10 秒内命中缓存，过期后回源',
                '连续刷新：时间戳每 10 秒才变一次',
                '比路由级 revalidate 粒度更细',
            ],
        },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">
                Fetch 缓存策略对比
            </h1>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-8">
                <p className="text-sm text-gray-700">
                    <strong>观察方法：</strong>三个时间戳来自同一个接口{' '}
                    <code className="bg-gray-100 px-1 rounded">/api/time</code>
                    （该接口本身强制实时执行），差异完全由 fetch 的 cache
                    配置产生。连续刷新页面，对比三列时间戳的变化节奏。
                    <br />
                    <strong>提示：</strong>dev 模式会禁用部分缓存，效果以{' '}
                    <code className="bg-gray-100 px-1 rounded">
                        next build && next start
                    </code>{' '}
                    为准。
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className={`border-l-4 p-5 rounded-lg ${card.cardClass}`}
                    >
                        <h2 className="text-sm font-mono font-semibold mb-1 text-gray-800 break-all">
                            {card.title}
                        </h2>
                        <p className={`text-xs mb-3 ${card.subtitleClass}`}>
                            {card.subtitle}
                        </p>
                        <p className="text-lg font-mono text-blue-600 mb-3">
                            {card.time}
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                            {card.points.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    核心代码
                </h2>
                <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                    <code>{`// 1. 显式缓存：结果存入 Data Cache，跨请求复用
fetch(url, { cache: 'force-cache' })

// 2. 不缓存：每次请求回源（SSR 效果）
fetch(url, { cache: 'no-store' })

// 3. 定时缓存：缓存 10 秒（请求粒度 ISR）
fetch(url, { next: { revalidate: 10 } })

// 不写 cache 配置时的默认行为（Next 14，面试易错点）：
//   静态路由中 → 等同 force-cache（缓存）
//   动态路由中 → 等同 no-store（不缓存）
//   Next 15 起 → 一律不缓存`}</code>
                </pre>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                    面试要点
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                    <li>
                        路由级控制（force-dynamic / revalidate）和请求级控制（fetch
                        cache 选项）是两套机制，请求级粒度更细，同页面可以混用
                    </li>
                    <li>
                        fetch 不写 cache 配置时的默认行为取决于路由：静态路由中默认缓存，
                        动态路由（如本页用了 headers()）中默认不缓存——所以本页第一列
                        显式写了 force-cache 来演示 Data Cache
                    </li>
                    <li>
                        force-dynamic 会把本路由所有 fetch 的默认行为强制为
                        no-store —— 所以本页用 headers() 而不是 force-dynamic
                    </li>
                    <li>
                        Next 14 → 15 的 breaking change：fetch 默认从缓存变为不缓存，
                        升级后"数据不更新"和"性能退化"问题都先想这个
                    </li>
                    <li>
                        除了 revalidate，fetch 还可以打{' '}
                        <code className="bg-gray-100 px-1 rounded">
                            next: {'{ tags }'}
                        </code>{' '}
                        标签，配合 revalidateTag 按需失效（见 /cache-demo）
                    </li>
                </ul>
            </div>
        </div>
    );
}
