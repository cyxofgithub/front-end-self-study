import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))
const name = pkg.name.replace(/-/g, '')
const globalName = 'SDKA'

export default defineConfig([
  // ESM 构建
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      resolve({
        preferBuiltins: false,
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
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
  // CommonJS 构建
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      resolve({
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({
        exclude: ['**/*.test.ts', '**/*.spec.ts'],
      }),
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
  // UMD/IIFE 构建（全局对象）
  {
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
        exclude: ['**/*.test.ts', '**/*.spec.ts'],
      }),
    ],
    external: [
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
])
