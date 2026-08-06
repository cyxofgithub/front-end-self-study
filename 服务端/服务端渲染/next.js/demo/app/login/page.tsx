'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

/**
 * 登录页 - 演示 Middleware 鉴权
 *
 * 访问 /blog-admin 等受保护路由时，middleware 会把未登录用户重定向到这里
 *
 * 注意：useSearchParams() 必须包在 <Suspense> 边界里，
 * 否则构建时该页的静态预渲染会直接报错。
 */
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/blog-admin';
    const [error, setError] = useState<string | null>(null);

    function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        // 简化的演示鉴权（生产环境请使用正式的认证方案）
        if (username === 'admin' && password === 'password') {
            // 设置认证 cookie
            document.cookie = 'isAuthenticated=true; path=/; max-age=3600';
            router.push(redirect);
        } else {
            setError('用户名或密码错误，试试：admin / password');
        }
    }

    return (
        <div className="max-w-md mx-auto mt-16">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">登录</h1>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
                    <p className="text-sm text-gray-700">
                        <strong>Day 4：Middleware 演示</strong>
                        <br />
                        本页配合 middleware 做路由保护。试试不登录直接访问{' '}
                        <code className="bg-gray-100 px-1 rounded">
                            /blog-admin
                        </code>
                        ，会被重定向到这里。
                        <br />
                        <br />
                        <strong>演示账号：</strong>admin / password
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            用户名
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            密码
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        登录
                    </button>
                </form>

                <div className="mt-6 text-sm text-gray-600">
                    <p>
                        登录成功后将跳转到：{' '}
                        <code className="bg-gray-100 px-1 rounded">
                            {redirect}
                        </code>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
