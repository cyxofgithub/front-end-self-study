'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

/**
 * Login Page - Demonstrates Middleware Authentication
 *
 * This page is used by the middleware to authenticate users
 * before accessing protected routes like /blog-admin
 */
export default function LoginPage() {
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

        // Simple demo authentication (in production, use proper auth)
        if (username === 'admin' && password === 'password') {
            // Set authentication cookie
            document.cookie = 'isAuthenticated=true; path=/; max-age=3600';
            router.push(redirect);
        } else {
            setError('Invalid username or password. Try: admin / password');
        }
    }

    return (
        <div className="max-w-md mx-auto mt-16">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Login</h1>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
                    <p className="text-sm text-gray-700">
                        <strong>Day 4: Middleware Demo</strong>
                        <br />
                        This login page is protected by middleware. Try
                        accessing{' '}
                        <code className="bg-gray-100 px-1 rounded">
                            /blog-admin
                        </code>{' '}
                        without logging in - you'll be redirected here.
                        <br />
                        <br />
                        <strong>Demo credentials:</strong> admin / password
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
                            Username
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
                            Password
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
                        Login
                    </button>
                </form>

                <div className="mt-6 text-sm text-gray-600">
                    <p>
                        After logging in, you'll be redirected to:{' '}
                        <code className="bg-gray-100 px-1 rounded">
                            {redirect}
                        </code>
                    </p>
                </div>
            </div>
        </div>
    );
}
