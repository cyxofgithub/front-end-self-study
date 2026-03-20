# 案例 6：CMS 系统 - 多租户设计

## 需求场景

SaaS 内容管理系统，多个客户（租户）使用同一套系统，但数据需要完全隔离。需要：

-   每个租户只能看到自己的数据
-   查询时自动过滤租户数据
-   支持租户级别的权限控制

## 第一次设计（错误）

```sql
-- 没有租户隔离
CREATE TABLE articles (
    article_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**问题**：所有租户的数据混在一起，无法隔离。

## 设计思路

**方案对比**：

1. **共享数据库，共享表**：每个表添加 `tenant_id`

    - 优点：实现简单，成本低
    - 缺点：数据量大时性能差，难以扩展

2. **共享数据库，独立表**：每个租户独立的表 `articles_tenant_1`

    - 优点：数据隔离好
    - 缺点：表数量多，难以管理

3. **独立数据库**：每个租户独立数据库
    - 优点：完全隔离，性能好
    - 缺点：成本高，难以维护

**选择**：对于中小型 SaaS，使用**方案 1**，每个表添加 `tenant_id`。

## 最终设计

```sql
-- 1. 租户表
CREATE TABLE tenants (
    tenant_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_name VARCHAR(100) NOT NULL,
    domain VARCHAR(100) UNIQUE COMMENT '租户域名',
    status TINYINT DEFAULT 1 COMMENT '1:正常 2:禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 文章表（添加tenant_id）
CREATE TABLE articles (
    article_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL COMMENT '租户ID',
    title VARCHAR(200) NOT NULL,
    content TEXT,
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_tenant_status (tenant_id, status)
) COMMENT '所有租户共享，通过tenant_id隔离';

-- 3. 用户表（添加tenant_id）
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
    UNIQUE KEY uk_tenant_username (tenant_id, username),
    UNIQUE KEY uk_tenant_email (tenant_id, email),
    INDEX idx_tenant_id (tenant_id)
);
```

**为什么需要区分租户表和用户表？**

-   租户（Tenant）：组织/公司/客户，是 SaaS 的购买方
-   用户（User）：租户内部的成员，是系统的使用者
    关系：一个租户可以有多个用户（1 对多）

## 设计要点

1. **所有表添加 tenant_id**：确保数据隔离
2. **唯一约束包含 tenant_id**：`UNIQUE KEY uk_tenant_username (tenant_id, username)`，同一租户内用户名必须唯一，但不同租户之间可以有相同的用户名
3. **索引设计**：所有查询条件都包含 `tenant_id`，所以索引以 `tenant_id` 开头

## 实际应用

```sql
-- 查询租户的文章（必须带上tenant_id）
SELECT * FROM articles
WHERE tenant_id = ? AND status = 1
ORDER BY created_at DESC;

-- 创建文章（自动注入tenant_id）
INSERT INTO articles (tenant_id, title, content)
VALUES (?, ?, ?);

-- 在应用层封装：所有查询自动添加tenant_id过滤
-- 例如：Article::where('tenant_id', $currentTenantId)->get();
```

## 掌握能力

学习完这个案例，你将掌握：

1. **多租户数据隔离**：理解如何通过 `tenant_id` 实现多租户数据隔离
2. **唯一约束设计**：掌握如何在多租户场景下设计唯一约束（包含 `tenant_id`）
3. **索引设计策略**：理解多租户场景下的索引设计，所有索引都以 `tenant_id` 开头
4. **查询安全**：学会在应用层确保所有查询都包含 `tenant_id` 过滤，防止数据泄露
5. **方案选择能力**：理解共享表、独立表、独立数据库三种方案的优缺点和适用场景

**应用场景**：SaaS 系统、多租户系统、企业级应用、任何需要数据隔离的场景

