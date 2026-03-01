'use client';

import { useEffect } from 'react';

interface ModalComponentProps {
    onClose: () => void;
}

/**
 * Modal Component - Client-only component that doesn't need SSR
 * Perfect candidate for dynamic import with ssr: false
 */
export default function ModalComponent({ onClose }: ModalComponentProps) {
    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    Modal Component
                </h3>
                <p className="text-gray-600 mb-6">
                    This modal component was loaded dynamically. It doesn't need
                    SSR because modals are typically triggered by user
                    interaction and don't need to be in the initial HTML.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                    <p className="text-sm text-blue-800">
                        <strong>Tip:</strong> Components that are only shown on
                        user interaction (modals, dropdowns, tooltips) are
                        perfect for code splitting with{' '}
                        <code className="bg-blue-100 px-1 rounded">
                            ssr: false
                        </code>
                        .
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Close Modal
                </button>
            </div>
        </div>
    );
}
