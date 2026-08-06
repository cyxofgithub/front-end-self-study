// 页脚的 Server Component
export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="text-center">
                    <p className="text-gray-400">
                        © 2024 Next.js 演示项目 - 学习第 1-3 天
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        这是一个覆盖 Next.js 基础知识的演示项目
                    </p>
                </div>
            </div>
        </footer>
    );
}
