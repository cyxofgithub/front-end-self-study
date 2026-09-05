const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// 客户端也读同一份 .proto 契约，这样字段编号才对得上
const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, 'proto/user.proto'),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);
const proto = grpc.loadPackageDefinition(packageDefinition).demo;

// 创建一个客户端，指向服务端地址
const client = new proto.UserService('localhost:50051', grpc.credentials.createInsecure());

// 调用远程方法——看起来就像调用本地函数
client.GetUser({ id: '123' }, (err, user) => {
  if (err) {
    console.error('[client] 出错:', err.message);
    return;
  }
  // user 是 User 反序列化后的对象，直接就能用
  console.log('[client] 收到:', user);
  console.log(`[client] 用户名 = ${user.name}`);

  // gRPC 客户端默认维持 HTTP/2 长连接，进程不会自己退出。
  // 真实服务里客户端常驻不需要这一步；这里是一次性演示，打印完就主动结束进程。
  client.close();
  process.exit(0);
});
