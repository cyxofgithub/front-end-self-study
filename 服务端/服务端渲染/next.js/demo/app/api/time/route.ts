import { NextResponse } from 'next/server';

// 强制该 API 每次请求都实时执行
// 这样 fetch-cache-demo 页面观察到的缓存差异，完全来自调用方 fetch 的 cache 配置
export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        time: new Date().toISOString(),
    });
}
