#!/bin/bash

# Babel Presets 测试脚本
# 用于快速测试不同的 preset 配置

# 获取当前目录的绝对路径
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 开始测试 Babel Presets..."
echo ""

# 1. React preset (旧 JSX 转换)
echo "📦 测试 React preset (旧 JSX 转换)..."
npx babel "$CURRENT_DIR/src/react-component.jsx" \
  --out-dir "$CURRENT_DIR/outputs/react" \
  --config-file "$CURRENT_DIR/configs/config-react.js"
echo "✅ React preset (旧) 编译完成"
echo ""

# 2. React preset (新 JSX 转换)
echo "📦 测试 React preset (新 JSX 转换)..."
npx babel "$CURRENT_DIR/src/react-component.jsx" \
  --out-dir "$CURRENT_DIR/outputs/react-automatic" \
  --config-file "$CURRENT_DIR/configs/config-react-automatic.js"
echo "✅ React preset (新) 编译完成"
echo ""

# 3. TypeScript preset
echo "📦 测试 TypeScript preset..."
npx babel "$CURRENT_DIR/src/typescript-example.ts" \
  --out-dir "$CURRENT_DIR/outputs/typescript" \
  --config-file "$CURRENT_DIR/configs/config-typescript.js" \
  --extensions ".ts"
echo "✅ TypeScript preset 编译完成"
echo ""

# 4. 组合 preset (React + TypeScript)
echo "📦 测试组合 preset (React + TypeScript)..."
npx babel "$CURRENT_DIR/src/react-typescript.tsx" \
  --out-dir "$CURRENT_DIR/outputs/combined" \
  --config-file "$CURRENT_DIR/configs/config-combined.js" \
  --extensions ".tsx"
echo "✅ 组合 preset 编译完成"
echo ""

echo "🎉 所有测试完成！"
echo ""
echo "📁 输出目录："
echo "  - outputs/react/          (React 旧 JSX 转换)"
echo "  - outputs/react-automatic/ (React 新 JSX 转换)"
echo "  - outputs/typescript/     (TypeScript)"
echo "  - outputs/combined/       (React + TypeScript)"
echo ""
echo "💡 提示：可以对比不同配置的输出文件查看差异"
