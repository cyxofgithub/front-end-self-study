'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Client Component for navigation with active state
export default function Navigation() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/blog', label: 'Blog' },
        { href: '/isr-demo', label: 'ISR Demo' },
        { href: '/csr-demo', label: 'CSR Demo' },
        { href: '/blog-admin', label: 'Blog Admin' },
        { href: '/api-demo', label: 'API Demo' },
    ];

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold">
                        Next.js Demo
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
