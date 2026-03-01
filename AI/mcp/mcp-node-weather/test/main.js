/**
 * MCP 天气服务器的测试用例
 * 测试 main.js 中的各种功能
 */
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const mainJsPath = join(__dirname, '../main.js');

// 辅助函数：与服务器通信
async function sendMessage(message) {
    return new Promise((resolve, reject) => {
        const server = spawn('node', [mainJsPath], {
            stdio: ['pipe', 'pipe', 'pipe'],
        });

        let output = '';
        let errorOutput = '';

        // 收集 stdout 输出（跳过启动消息）
        server.stdout.on('data', (data) => {
            const text = data.toString();
            // 跳过启动消息
            if (text.includes('✅ Node.js MCP 天气服务器已启动')) {
                return;
            }
            output += text;
        });

        // 收集 stderr 输出
        server.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        // 处理进程退出
        server.on('close', (code) => {
            if (code !== 0 && errorOutput) {
                reject(
                    new Error(`服务器退出，代码：${code}，错误：${errorOutput}`)
                );
            } else {
                resolve(output.trim());
            }
        });

        // 发送消息并关闭 stdin
        server.stdin.write(message + '\n');
        server.stdin.end();

        // 设置超时
        setTimeout(() => {
            server.kill();
            reject(new Error('测试超时'));
        }, 5000);
    });
}

// 测试用例
async function runTests() {
    console.log('🧪 开始测试 MCP 天气服务器...\n');

    let passedTests = 0;
    let failedTests = 0;

    // 测试辅助函数
    async function test(name, testFn) {
        try {
            await testFn();
            console.log(`✅ ${name}`);
            passedTests++;
        } catch (error) {
            console.error(`❌ ${name}`);
            console.error(`   错误：${error.message}`);
            failedTests++;
        }
    }

    // 1. 测试 discover 请求
    await test('测试 discover 请求 - 返回服务器能力列表', async () => {
        const message = JSON.stringify({ type: 'discover' });
        const response = await sendMessage(message);
        const data = JSON.parse(response);
        console.log('🚀 ~ runTests ~ data:', data);
    });

    // 2. 测试 invoke 请求 - 正常情况
    await test('测试 invoke 请求 - 查询北京天气（默认3天）', async () => {
        const message = JSON.stringify({
            type: 'invoke',
            name: 'get_forecast',
            parameters: { city: '北京' },
        });
        const response = await sendMessage(message);
        const data = JSON.parse(response);
        console.log('🚀 ~ runTests ~ data:', data);
    });

    // 4. 测试 prompt 请求
    await test('测试 prompt 请求 - weather_query', async () => {
        const message = JSON.stringify({
            type: 'prompt',
            name: 'weather_query',
            arguments: { city: '上海', days: 3 },
        });
        const response = await sendMessage(message);
        const data = JSON.parse(response);
        console.log('🚀 ~ runTests ~ data:', data);
    });

    await test('测试 prompt 请求 - weather_analysis', async () => {
        const message = JSON.stringify({
            type: 'prompt',
            name: 'weather_analysis',
            arguments: { city: '深圳', days: 5 },
        });
        const response = await sendMessage(message);
        const data = JSON.parse(response);
        console.log('🚀 ~ runTests ~ data:', data);
    });

    await test('测试 prompt 请求 - travel_suggestion', async () => {
        const message = JSON.stringify({
            type: 'prompt',
            name: 'travel_suggestion',
            arguments: { city: '成都', days: 7 },
        });
        const response = await sendMessage(message);
        const data = JSON.parse(response);
        console.log('🚀 ~ runTests ~ data:', data);
    });

    // 测试总结
    console.log('\n📊 测试总结：');
    console.log(`✅ 通过：${passedTests} 个`);
    console.log(`❌ 失败：${failedTests} 个`);
    console.log(`📈 总计：${passedTests + failedTests} 个\n`);

    if (failedTests === 0) {
        console.log('🎉 所有测试通过！');
        process.exit(0);
    } else {
        console.log('⚠️  部分测试失败，请检查代码');
        process.exit(1);
    }
}

// 运行测试
runTests().catch((error) => {
    console.error('测试运行失败：', error);
    process.exit(1);
});
