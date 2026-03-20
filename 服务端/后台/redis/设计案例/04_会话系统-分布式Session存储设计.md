# 案例 4：会话系统 - 分布式 Session 存储设计

## 需求场景

分布式系统中，需要实现用户会话管理，要求：

-   用户登录后创建 Session，存储用户信息
-   支持 Session 过期（自动清理）
-   支持 Session 刷新（延长过期时间）
-   支持多设备登录（同一用户多个 Session）
-   支持强制下线（删除指定 Session）
-   支持查询在线用户数

## 第一次设计（错误）

```javascript
// 错误示例：使用内存存储 Session（单机）
const sessions = new Map();

function createSession(userId) {
    const sessionId = generateSessionId();
    sessions.set(sessionId, {
        userId: userId,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000, // 1小时
    });
    return sessionId;
}

function getSession(sessionId) {
    const session = sessions.get(sessionId);
    if (!session || session.expiresAt < Date.now()) {
        return null;
    }
    return session;
}
```

**问题 1**：单机存储，多服务器环境下无法共享 Session
**问题 2**：内存存储，服务器重启后 Session 丢失
**问题 3**：没有自动清理机制，内存泄漏
**问题 4**：无法支持多设备登录管理

## 设计思路

**核心问题**：

1. 如何实现分布式 Session？→ 使用 Redis 存储 Session 数据
2. 如何实现自动过期？→ 使用 Redis 的 EXPIRE 机制
3. 如何支持多设备登录？→ 使用 Set 存储用户的所有 Session ID
4. 如何快速查询在线用户？→ 使用 Set 存储所有在线用户的 Session

**解决方案**：

-   Session 数据：Redis String（JSON 格式），key: `session:{sessionId}`
-   用户 Session 列表：Redis Set，key: `user:sessions:{userId}`
-   在线用户集合：Redis Set，key: `online:users`
-   Session 索引：Redis Hash，key: `session:index:{sessionId}`（可选，用于快速查询）

## 最终设计

### Redis 数据结构设计

```redis
# Session 数据（String，JSON格式）
session:abc123def456 -> {
  "userId": 100,
  "username": "zhangsan",
  "loginTime": "1701417600000",
  "lastAccessTime": "1701417600000",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0..."
}
TTL: 3600秒（1小时，可刷新）

# 用户的所有 Session ID 集合（Set）
user:sessions:100 -> {abc123def456, xyz789ghi012, ...}
# 用于管理用户的多设备登录

# 在线用户集合（Set）
online:users -> {100, 101, 102, ...}
# 存储所有在线用户的 userId

# Session 索引（Hash，可选）
session:index:abc123def456 -> {
  "userId": "100",
  "createdAt": "1701417600000"
}
TTL: 3600秒
```

### 代码实现

```javascript
const redis = require('redis');
const crypto = require('crypto');
const client = redis.createClient();

const SESSION_TTL = 3600; // 1小时
const SESSION_REFRESH_THRESHOLD = 300; // 剩余5分钟时刷新

/**
 * 生成 Session ID
 */
function generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * 创建 Session
 */
async function createSession(userId, userInfo, ip, userAgent) {
    const sessionId = generateSessionId();
    const now = Date.now();

    const sessionData = {
        userId: userId,
        username: userInfo.username,
        email: userInfo.email,
        loginTime: now,
        lastAccessTime: now,
        ip: ip,
        userAgent: userAgent,
    };

    const sessionKey = `session:${sessionId}`;
    const userSessionsKey = `user:sessions:${userId}`;
    const onlineUsersKey = 'online:users';

    // 使用事务保证原子性
    const multi = client.multi();

    // 1. 存储 Session 数据
    multi.setEx(sessionKey, SESSION_TTL, JSON.stringify(sessionData));

    // 2. 添加到用户的 Session 列表
    multi.sAdd(userSessionsKey, sessionId);

    // 3. 设置用户 Session 列表的过期时间（比单个 Session 稍长）
    multi.expire(userSessionsKey, SESSION_TTL + 60);

    // 4. 添加到在线用户集合
    multi.sAdd(onlineUsersKey, userId.toString());

    await multi.exec();

    return sessionId;
}

/**
 * 获取 Session
 */
async function getSession(sessionId) {
    const sessionKey = `session:${sessionId}`;
    const sessionData = await client.get(sessionKey);

    if (!sessionData) {
        return null;
    }

    const session = JSON.parse(sessionData);

    // 检查是否需要刷新（剩余时间少于阈值）
    const ttl = await client.ttl(sessionKey);
    if (ttl < SESSION_REFRESH_THRESHOLD) {
        await refreshSession(sessionId);
    } else {
        // 更新最后访问时间
        session.lastAccessTime = Date.now();
        await client.setEx(sessionKey, ttl, JSON.stringify(session));
    }

    return session;
}

/**
 * 刷新 Session（延长过期时间）
 */
async function refreshSession(sessionId) {
    const sessionKey = `session:${sessionId}`;
    const sessionData = await client.get(sessionKey);

    if (!sessionData) {
        return false;
    }

    const session = JSON.parse(sessionData);
    session.lastAccessTime = Date.now();

    // 重新设置过期时间
    await client.setEx(sessionKey, SESSION_TTL, JSON.stringify(session));

    return true;
}

/**
 * 删除 Session（登出）
 */
async function deleteSession(sessionId) {
    const sessionKey = `session:${sessionId}`;
    const sessionData = await client.get(sessionKey);

    if (!sessionData) {
        return false;
    }

    const session = JSON.parse(sessionData);
    const userId = session.userId;
    const userSessionsKey = `user:sessions:${userId}`;
    const onlineUsersKey = 'online:users';

    const multi = client.multi();

    // 1. 删除 Session 数据
    multi.del(sessionKey);

    // 2. 从用户的 Session 列表中移除
    multi.sRem(userSessionsKey, sessionId);

    // 3. 如果用户没有其他 Session，从在线用户集合中移除
    multi.sCard(userSessionsKey).then((count) => {
        if (count === 0) {
            client.sRem(onlineUsersKey, userId.toString());
        }
    });

    await multi.exec();

    return true;
}

/**
 * 获取用户的所有 Session
 */
async function getUserSessions(userId) {
    const userSessionsKey = `user:sessions:${userId}`;
    const sessionIds = await client.sMembers(userSessionsKey);

    const sessions = [];
    for (const sessionId of sessionIds) {
        const sessionData = await client.get(`session:${sessionId}`);
        if (sessionData) {
            sessions.push({
                sessionId: sessionId,
                ...JSON.parse(sessionData),
            });
        } else {
            // Session 已过期，从列表中移除
            await client.sRem(userSessionsKey, sessionId);
        }
    }

    return sessions;
}

/**
 * 强制用户下线（删除用户所有 Session）
 */
async function forceLogout(userId) {
    const userSessionsKey = `user:sessions:${userId}`;
    const sessionIds = await client.sMembers(userSessionsKey);
    const onlineUsersKey = 'online:users';

    if (sessionIds.length === 0) {
        return false;
    }

    const multi = client.multi();

    // 删除所有 Session
    for (const sessionId of sessionIds) {
        multi.del(`session:${sessionId}`);
    }

    // 清空用户的 Session 列表
    multi.del(userSessionsKey);

    // 从在线用户集合中移除
    multi.sRem(onlineUsersKey, userId.toString());

    await multi.exec();

    return true;
}

/**
 * 删除指定设备的 Session（多设备登录管理）
 */
async function deleteDeviceSession(userId, sessionId) {
    const userSessionsKey = `user:sessions:${userId}`;
    const isMember = await client.sIsMember(userSessionsKey, sessionId);

    if (!isMember) {
        return false;
    }

    return await deleteSession(sessionId);
}

/**
 * 获取在线用户数
 */
async function getOnlineUserCount() {
    const onlineUsersKey = 'online:users';
    const count = await client.sCard(onlineUsersKey);
    return count;
}

/**
 * 获取在线用户列表（分页）
 */
async function getOnlineUsers(page = 1, pageSize = 100) {
    const onlineUsersKey = 'online:users';
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const userIds = await client.sRandMember(onlineUsersKey, pageSize);
    return userIds.map((id) => parseInt(id));
}

/**
 * 清理过期 Session（定时任务）
 */
async function cleanExpiredSessions() {
    // Redis 的 EXPIRE 机制会自动清理过期的 key
    // 这里只需要清理用户 Session 列表中的无效引用

    const pattern = 'user:sessions:*';
    const keys = [];

    // 注意：生产环境应使用 SCAN 而不是 KEYS
    const cursor = 0;
    let [nextCursor, userSessionKeys] = await client.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
    });

    keys.push(...userSessionKeys);

    while (nextCursor !== '0') {
        [nextCursor, userSessionKeys] = await client.scan(nextCursor, {
            MATCH: pattern,
            COUNT: 100,
        });
        keys.push(...userSessionKeys);
    }

    for (const userSessionsKey of keys) {
        const sessionIds = await client.sMembers(userSessionsKey);

        for (const sessionId of sessionIds) {
            const exists = await client.exists(`session:${sessionId}`);
            if (!exists) {
                // Session 已过期，从列表中移除
                await client.sRem(userSessionsKey, sessionId);
            }
        }

        // 如果列表为空，删除该 key
        const count = await client.sCard(userSessionsKey);
        if (count === 0) {
            await client.del(userSessionsKey);
        }
    }

    console.log(`清理完成，检查了 ${keys.length} 个用户的 Session`);
}
```

## 真实数据示例

```redis
# 用户100的 Session
session:abc123def456 -> {
  "userId": 100,
  "username": "zhangsan",
  "loginTime": "1701417600000",
  "lastAccessTime": "1701417600000",
  "ip": "192.168.1.100"
}
TTL: 3600秒

# 用户100的所有 Session ID
user:sessions:100 -> {abc123def456, xyz789ghi012}
# 表示用户100在两个设备上登录

# 在线用户集合
online:users -> {100, 101, 102, 103, ...}
# 当前在线用户ID集合
```

## 设计要点

1. **分布式存储**：使用 Redis 存储 Session，支持多服务器共享
2. **自动过期**：利用 Redis EXPIRE 机制自动清理过期 Session
3. **自动刷新**：剩余时间少于阈值时自动延长过期时间
4. **多设备支持**：使用 Set 存储用户的所有 Session，支持多设备登录管理
5. **在线用户统计**：使用 Set 快速统计和查询在线用户
6. **原子性操作**：使用 Redis 事务保证多个操作的原子性
7. **定期清理**：定时任务清理无效的 Session 引用

## 实际应用

```javascript
// 1. 用户登录，创建 Session
const sessionId = await createSession(
    100,
    {
        username: 'zhangsan',
        email: 'zhangsan@example.com',
    },
    '192.168.1.100',
    'Mozilla/5.0...'
);
console.log(`Session ID: ${sessionId}`);

// 2. 验证 Session
const session = await getSession(sessionId);
if (session) {
    console.log(`用户 ${session.username} 已登录`);
} else {
    console.log('Session 无效或已过期');
}

// 3. 查询用户的所有 Session（多设备）
const userSessions = await getUserSessions(100);
console.log(`用户100在 ${userSessions.length} 个设备上登录`);

// 4. 强制用户下线
await forceLogout(100);
console.log('用户100已强制下线');

// 5. 查询在线用户数
const onlineCount = await getOnlineUserCount();
console.log(`当前在线用户数: ${onlineCount}`);

// 6. 定时清理过期 Session（建议每小时执行一次）
setInterval(() => {
    cleanExpiredSessions();
}, 3600000);
```

## 掌握能力

学习完这个案例，你将掌握：

1. **分布式 Session**：理解如何使用 Redis 实现分布式 Session 存储
2. **自动过期机制**：掌握 Redis EXPIRE 的使用，实现自动清理
3. **Session 刷新**：学会在用户活跃时自动延长 Session 过期时间
4. **多设备管理**：掌握如何管理用户的多设备登录
5. **在线用户统计**：理解如何使用 Set 快速统计在线用户
6. **强制下线**：学会实现强制用户下线的功能
7. **定期清理**：掌握定时清理过期数据的技巧

**应用场景**：分布式 Web 应用、微服务架构、单点登录（SSO）、会话管理、在线用户统计
