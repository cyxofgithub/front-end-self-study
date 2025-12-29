# MySQL 持久化配置说明

## 📋 概述

本项目已集成 MySQL 数据库持久化功能，可以将 Yjs 文档状态保存到 MySQL 数据库中，确保数据持久化和服务器重启后数据不丢失。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 初始化数据库

#### 方式一：使用 MySQL 命令行

```bash
mysql -u root -p < init-db.sql
```

#### 方式二：手动执行 SQL

1. 登录 MySQL：

```bash
mysql -u root -p
```

2. 执行 `init-db.sql` 文件中的 SQL 语句

### 3. 配置数据库连接

#### 方式一：使用环境变量（推荐）

```bash
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_USER=root
export MYSQL_PASSWORD=your_password
export MYSQL_DATABASE=yjs_db
export MYSQL_TABLE_NAME=yjs_documents

npm start
```

#### 方式二：修改 server.js 中的默认配置

编辑 `server.js` 文件，修改 `mysqlConfig` 对象：

```javascript
const mysqlConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'your_password',
    database: 'yjs_db',
    tableName: 'yjs_documents',
};
```

### 4. 启动服务器

```bash
npm start
```

## 📊 数据库表结构

### yjs_documents 表

| 字段名      | 类型         | 说明                       |
| ----------- | ------------ | -------------------------- |
| doc_name    | VARCHAR(255) | 文档名称（主键）           |
| update_data | LONGBLOB     | Yjs 文档状态数据（二进制） |
| updated_at  | TIMESTAMP    | 最后更新时间               |

## 🔧 工作原理

1. **文档加载**：当客户端连接时，服务器会从 MySQL 数据库加载文档的持久化状态
2. **实时同步**：文档更新会实时同步到所有连接的客户端
3. **持久化保存**：文档更新会以 1 秒防抖的方式保存到 MySQL 数据库
4. **数据恢复**：服务器重启后，文档状态会自动从数据库恢复

## ⚙️ 配置选项

### 环境变量

| 变量名           | 默认值        | 说明             |
| ---------------- | ------------- | ---------------- |
| MYSQL_HOST       | localhost     | MySQL 服务器地址 |
| MYSQL_PORT       | 3306          | MySQL 服务器端口 |
| MYSQL_USER       | root          | MySQL 用户名     |
| MYSQL_PASSWORD   | (空)          | MySQL 密码       |
| MYSQL_DATABASE   | yjs_db        | 数据库名称       |
| MYSQL_TABLE_NAME | yjs_documents | 表名             |

### 防抖配置

文档更新会使用 1 秒防抖来减少数据库写入频率，可以在 `mysql-persistence.js` 中修改：

```javascript
updateTimeout = setTimeout(() => {
    updateHandler(update, origin);
}, 1000); // 修改这里的延迟时间（毫秒）
```

## 🐛 故障排除

### 问题：MySQL 连接失败

**解决方案**：

1. 检查 MySQL 服务是否运行：`mysql -u root -p`
2. 检查数据库是否存在：`SHOW DATABASES;`
3. 检查用户权限：确保用户有创建表和插入数据的权限
4. 检查防火墙设置：确保端口 3306 未被阻止

### 问题：表不存在

**解决方案**：

1. 运行 `init-db.sql` 脚本初始化数据库
2. 检查 `MYSQL_DATABASE` 环境变量是否正确

### 问题：数据未保存

**解决方案**：

1. 检查服务器日志，查看是否有错误信息
2. 确认 MySQL 持久化模块已成功初始化（日志中应显示 "✅ MySQL 持久化已启用"）
3. 检查数据库连接配置是否正确

## 📝 注意事项

1. **性能考虑**：文档更新使用防抖机制，可能会有最多 1 秒的延迟
2. **数据备份**：建议定期备份 MySQL 数据库
3. **连接池**：默认连接池大小为 10，可以在 `mysql-persistence.js` 中调整
4. **无持久化模式**：如果 MySQL 连接失败，服务器会在无持久化模式下运行（数据仅存储在内存中）

## 🔍 查看存储的数据

```sql
-- 查看所有文档
SELECT doc_name, updated_at, LENGTH(update_data) AS data_size
FROM yjs_documents;

-- 查看特定文档
SELECT doc_name, updated_at, LENGTH(update_data) AS data_size
FROM yjs_documents
WHERE doc_name = 'demo';

-- 删除文档（谨慎操作）
DELETE FROM yjs_documents WHERE doc_name = 'demo';
```

## 🎯 生产环境建议

1. **使用专用数据库用户**：不要使用 root 用户，创建专用用户并授予最小权限
2. **启用 SSL 连接**：在生产环境中启用 MySQL SSL 连接
3. **配置连接池**：根据并发连接数调整连接池大小
4. **定期备份**：设置数据库自动备份策略
5. **监控日志**：监控数据库连接和查询性能
