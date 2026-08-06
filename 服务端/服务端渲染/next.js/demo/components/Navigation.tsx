'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 带激活状态的导航 Client Component
export default function Navigation() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: '首页' },
        { href: '/about', label: '关于' },
        { href: '/blog', label: '博客' },
        { href: '/isr-demo', label: 'ISR 演示' },
        { href: '/csr-demo', label: 'CSR 演示' },
        { href: '/blog-admin', label: '博客管理' },
        { href: '/api-demo', label: 'API 演示' },
    ];

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold">
                        Next.js 演示
                    </Link>
                    <ul className="flex space-x-6">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`px-3 py-2 rounded transition-colors ${
                                            isActive
                                                ? 'bg-blue-700 font-semibold'
                                                : 'hover:bg-blue-500'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
