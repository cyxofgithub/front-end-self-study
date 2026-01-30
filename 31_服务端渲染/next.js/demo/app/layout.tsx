import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// Font optimization - automatically optimizes font loading
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

// Root layout component - wraps all pages
export const metadata: Metadata = {
    title: 'Next.js Demo - Day 1-7',
    description:
        'A comprehensive demonstration project covering Next.js fundamentals from Day 1 to Day 7',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="flex flex-col min-h-screen font-sans">
                <Navigation />
                <main className="flex-grow container mx-auto px-4 py-8">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
