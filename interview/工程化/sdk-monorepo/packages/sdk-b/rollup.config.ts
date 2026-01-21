import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))
const globalName = 'SDKB'

export default defineConfig({
  // 仅 UMD 格式构建
  input: 'src/index.ts',
  output: {
    file: 'dist/index.umd.js',
    format: 'umd',
    name: globalName,
    sourcemap: true,
    exports: 'named',
    globals: {},
  },
  plugins: [
    resolve({
      preferBuiltins: false,
      browser: true,
    }),
    commonjs(),
    typescript({
      declaration: true,
      declarationDir: './dist',
      rootDir: './src',
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
    }),
  ],
  external: [
    ...Object.keys(pkg.peerDependencies || {}),
  ],
})
