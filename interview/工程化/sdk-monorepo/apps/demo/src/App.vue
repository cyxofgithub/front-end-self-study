<template>
  <div class="app">
    <h1>SDK Demo 测试应用</h1>
    
    <div class="section">
      <h2>SDK A 测试（源码）</h2>
      <p>支持 ESM、CJS、UMD 格式</p>
      <button @click="testSDKA">测试 SDK A（源码）</button>
      <div class="result" v-if="resultA">
        <pre>{{ resultA }}</pre>
      </div>
    </div>

    <div class="section">
      <h2>SDK B 测试（源码）</h2>
      <p>仅支持 UMD 格式</p>
      <button @click="testSDKB">测试 SDK B（源码）</button>
      <div class="result" v-if="resultB">
        <pre>{{ resultB }}</pre>
      </div>
    </div>

    <div class="section">
      <h2>打包后 SDK 测试</h2>
      <div class="test-group">
        <h3>SDK A - ESM 格式（打包后）</h3>
        <button @click="testSDKAESM">测试 ESM 格式</button>
        <div class="result" v-if="resultAESM">
          <pre>{{ resultAESM }}</pre>
        </div>
      </div>
      
      <div class="test-group">
        <h3>SDK A - UMD 格式（打包后）</h3>
        <button @click="testSDKAUMD">测试 UMD 格式</button>
        <div class="result" v-if="resultAUMD">
          <pre>{{ resultAUMD }}</pre>
        </div>
      </div>

      <div class="test-group">
        <h3>SDK B - UMD 格式（打包后）</h3>
        <button @click="testSDKBUMD">测试 UMD 格式</button>
        <div class="result" v-if="resultBUMD">
          <pre>{{ resultBUMD }}</pre>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>控制台输出</h2>
      <p>请打开浏览器控制台查看打印结果</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { sdkA, type SDKAType } from 'sdk-a'
import { sdkB, type SDKBType } from 'sdk-b'

const resultA = ref<string>('')
const resultB = ref<string>('')
const resultAESM = ref<string>('')
const resultAUMD = ref<string>('')
const resultBUMD = ref<string>('')

// 测试源码版本
const testSDKA = () => {
  const options: SDKAType = {
    name: 'SDK-A-Test',
    version: '1.0.0',
  }
  sdkA(options)
  resultA.value = `调用成功！参数: ${JSON.stringify(options, null, 2)}`
}

const testSDKB = () => {
  const options: SDKBType = {
    id: 100,
    message: 'Hello from Vue3 Demo',
  }
  sdkB(options)
  resultB.value = `调用成功！参数: ${JSON.stringify(options, null, 2)}`
}

// 测试打包后的 ESM 版本
const testSDKAESM = async () => {
  try {
    // 动态导入打包后的 ESM 文件
    // 注意：需要先构建 SDK (pnpm build)
    const modulePath = '/packages/sdk-a/dist/index.esm.js'
    const sdkAModule = await import(/* @vite-ignore */ modulePath) as { sdkA?: (options?: SDKAType) => void }
    
    const options: SDKAType = {
      name: 'SDK-A-ESM-Built',
      version: '1.0.0',
    }
    
    if (sdkAModule && sdkAModule.sdkA) {
      sdkAModule.sdkA(options)
      resultAESM.value = `ESM 格式调用成功！参数: ${JSON.stringify(options, null, 2)}`
    } else {
      resultAESM.value = 'ESM 模块未正确导出 sdkA 方法'
    }
  } catch (error) {
    resultAESM.value = `ESM 格式调用失败: ${error instanceof Error ? error.message : String(error)}\n\n提示：请先运行以下命令构建 SDK：\npnpm build:a`
  }
}

// 测试打包后的 UMD 版本（SDK A）
const testSDKAUMD = () => {
  try {
    // 检查全局对象是否已加载
    if (typeof (window as any).SDKA === 'undefined') {
      // 动态加载 UMD 文件
      const script = document.createElement('script')
      // 使用配置好的静态资源路径
      script.src = '/packages/sdk-a/dist/index.umd.js'
      script.onload = () => {
        const SDKA = (window as any).SDKA
        if (SDKA && SDKA.sdkA) {
          const options: SDKAType = {
            name: 'SDK-A-UMD-Built',
            version: '1.0.0',
          }
          SDKA.sdkA(options)
          resultAUMD.value = `UMD 格式调用成功！参数: ${JSON.stringify(options, null, 2)}`
        } else {
          resultAUMD.value = 'SDKA 全局对象未正确加载，请检查构建文件'
        }
      }
      script.onerror = () => {
        resultAUMD.value = 'UMD 文件加载失败\n\n提示：请先运行以下命令构建 SDK：\npnpm build:a\n然后刷新页面重试'
      }
      document.head.appendChild(script)
    } else {
      const SDKA = (window as any).SDKA
      const options: SDKAType = {
        name: 'SDK-A-UMD-Built',
        version: '1.0.0',
      }
      SDKA.sdkA(options)
      resultAUMD.value = `UMD 格式调用成功！参数: ${JSON.stringify(options, null, 2)}`
    }
  } catch (error) {
    resultAUMD.value = `UMD 格式调用失败: ${error instanceof Error ? error.message : String(error)}`
  }
}

// 测试打包后的 UMD 版本（SDK B）
const testSDKBUMD = () => {
  try {
    // 检查全局对象是否已加载
    if (typeof (window as any).SDKB === 'undefined') {
      // 动态加载 UMD 文件
      const script = document.createElement('script')
      // 使用配置好的静态资源路径
      script.src = '/packages/sdk-b/dist/index.umd.js'
      script.onload = () => {
        const SDKB = (window as any).SDKB
        if (SDKB && SDKB.sdkB) {
          const options: SDKBType = {
            id: 200,
            message: 'Hello from UMD Built SDK-B',
          }
          SDKB.sdkB(options)
          resultBUMD.value = `UMD 格式调用成功！参数: ${JSON.stringify(options, null, 2)}`
        } else {
          resultBUMD.value = 'SDKB 全局对象未正确加载，请检查构建文件'
        }
      }
      script.onerror = () => {
        resultBUMD.value = 'UMD 文件加载失败\n\n提示：请先运行以下命令构建 SDK：\npnpm build:b\n然后刷新页面重试'
      }
      document.head.appendChild(script)
    } else {
      const SDKB = (window as any).SDKB
      const options: SDKBType = {
        id: 200,
        message: 'Hello from UMD Built SDK-B',
      }
      SDKB.sdkB(options)
      resultBUMD.value = `UMD 格式调用成功！参数: ${JSON.stringify(options, null, 2)}`
    }
  } catch (error) {
    resultBUMD.value = `UMD 格式调用失败: ${error instanceof Error ? error.message : String(error)}`
  }
}
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  text-align: center;
}

.section {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

h2 {
  color: #555;
  margin-top: 0;
}

h3 {
  color: #666;
  font-size: 16px;
  margin: 15px 0 10px 0;
}

.test-group {
  margin: 20px 0;
  padding: 15px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background: #0056b3;
}

.result {
  margin-top: 15px;
  padding: 10px;
  background: #e9ecef;
  border-radius: 4px;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
