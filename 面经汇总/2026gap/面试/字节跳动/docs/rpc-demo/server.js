const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// 1. 从 .proto 契约加载服务定义（「强契约」的由来：两端读同一份文件）
const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, 'proto/user.proto'),
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    }
);
const proto = grpc.loadPackageDefinition(packageDefinition).demo;

// 2. 实现 UserService 的方法——方法名要和 .proto 里一致
function getUser(call, callback) {
    // call.request 是 GetUserRequest 反序列化后的对象
    const id = call.request.id;
    console.log(`[server] 收到查询用户 id=${id}`);

    // 这里假装查了数据库，返回一个用户对象
    const user = { id, name: 'Alice1', age: '241' };

    // callback 第一个参数是错误，null 表示成功；第二个参数是返回值（User）
    callback(null, user);
}

function main() {
    const server = new grpc.Server();
    // 把方法挂到服务上
    server.addService(proto.UserService.service, { GetUser: getUser });

    // 监听 50051 端口（insecure = 不加密，本地演示够用）
    server.bindAsync(
        '0.0.0.0:50051',
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(`[server] 监听在 0.0.0.0:${port}`);
        }
    );
}

main();
