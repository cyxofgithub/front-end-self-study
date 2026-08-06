'use client';

import { useEffect } from 'react';

interface ModalComponentProps {
    onClose: () => void;
}

/**
 * 模态框组件 - 不需要 SSR 的纯客户端组件
 * 是使用 ssr: false 进行 dynamic import 的完美候选
 */
export default function ModalComponent({ onClose }: ModalComponentProps) {
    useEffect(() => {
        // 模态框打开时禁止页面滚动
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    模态框组件
                </h3>
                <p className="text-gray-600 mb-6">
                    这个模态框组件是动态加载的。它不需要
                    SSR，因为模态框通常由用户交互触发，不需要出现在初始
                    HTML 中。
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                    <p className="text-sm text-blue-800">
                        <strong>提示：</strong>只在用户交互时才显示的组件（模态框、下拉菜单、工具提示）非常适合配合{' '}
                        <code className="bg-blue-100 px-1 rounded">
                            ssr: false
                        </code>{' '}
                        进行代码分割。
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    关闭模态框
                </button>
            </div>
        </div>
    );
}
