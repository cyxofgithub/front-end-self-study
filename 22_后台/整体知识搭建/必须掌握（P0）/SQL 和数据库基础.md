## SQL 和数据库基础速览

### 1. 数据库基本概念

**数据库（Database）**：存储数据的仓库，可以理解为多个表的集合。

**表（Table）**：数据的二维结构，由行（记录）和列（字段）组成。

**记录（Row）**：表中的一行数据，代表一个实体。

**字段（Column）**：表中的一列，表示数据的属性。

```sql
-- 示例：用户表 users
-- 字段：id, name, email, age
-- 记录：每一行代表一个用户
```

### 2. 数据类型

常用数据类型：

```sql
-- 整数类型
INT           -- 整数，-2147483648 到 2147483647
BIGINT        -- 大整数
TINYINT       -- 小整数（0-255）
SMALLINT      -- 短整数

-- 浮点数类型
DECIMAL(10, 2)  -- 精确小数，10位总长度，2位小数
FLOAT          -- 单精度浮点数
DOUBLE         -- 双精度浮点数

-- 字符串类型
VARCHAR(255)   -- 可变长度字符串，最大255字符
CHAR(10)       -- 固定长度字符串，10字符
TEXT           -- 长文本

-- 日期时间类型
DATE           -- 日期（YYYY-MM-DD）
DATETIME       -- 日期时间（YYYY-MM-DD HH:MM:SS）
TIMESTAMP      -- 时间戳

-- 布尔类型
BOOLEAN        -- 布尔值（TRUE/FALSE）
TINYINT(1)     -- MySQL 中常用 0/1 表示布尔
```

### 3. 创建表（CREATE TABLE）

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

常用约束：

-   `PRIMARY KEY`：主键，唯一标识每行数据
-   `AUTO_INCREMENT`：自动递增（MySQL）
-   `NOT NULL`：不允许为空
-   `UNIQUE`：唯一值
-   `DEFAULT`：默认值
-   `FOREIGN KEY`：外键，关联其他表

### 4. 插入数据（INSERT）

```sql
-- 插入单条数据
INSERT INTO users (name, email, age)
VALUES ('Alice', 'alice@example.com', 25);

-- 插入多条数据
INSERT INTO users (name, email, age)
VALUES
    ('Bob', 'bob@example.com', 30),
    ('Charlie', 'charlie@example.com', 28);

-- 插入所有字段（可省略字段名）
INSERT INTO users VALUES (NULL, 'David', 'david@example.com', 32, NOW());
```

### 5. 查询数据（SELECT）

```sql
-- 查询所有字段
SELECT * FROM users;

-- 查询指定字段
SELECT name, email FROM users;

-- 条件查询
SELECT * FROM users WHERE age > 25;

-- 多条件查询
SELECT * FROM users
WHERE age > 25 AND email LIKE '%@example.com';（这里的 LIKE 用于模糊匹配。）

-- 排序
SELECT * FROM users ORDER BY age DESC;

-- 限制结果数量
SELECT * FROM users LIMIT 10;
SELECT * FROM users LIMIT 5, 10;  -- 跳过5条，取10条
```

常用条件操作符：

-   `=`：等于
-   `!=` 或 `<>`：不等于
-   `>`、`<`、`>=`、`<=`：比较运算符
-   `LIKE`：模糊匹配（`%` 任意字符，`_` 单个字符）
-   `IN`：在列表中（`WHERE id IN (1, 2, 3)`）
-   `BETWEEN`：范围（`WHERE age BETWEEN 20 AND 30`）
-   `IS NULL` / `IS NOT NULL`：空值判断

### 6. 更新数据（UPDATE）

```sql
-- 更新单条记录
UPDATE users
SET age = 26, email = 'alice_new@example.com'
WHERE id = 1;

-- 更新多条记录
UPDATE users
SET age = age + 1
WHERE age < 30;

-- ⚠️ 注意：UPDATE 必须使用 WHERE，否则会更新所有记录
```

### 7. 删除数据（DELETE）

```sql
-- 删除指定记录
DELETE FROM users WHERE id = 1;

-- 删除满足条件的记录
DELETE FROM users WHERE age < 18;

-- ⚠️ 注意：DELETE 必须使用 WHERE，否则会删除所有记录

-- 清空表（更快，但无法回滚）
TRUNCATE TABLE users;
```

### 8. 表操作（ALTER TABLE）

```sql
-- 添加字段
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- 修改字段类型
ALTER TABLE users MODIFY COLUMN age SMALLINT;

-- 删除字段
ALTER TABLE users DROP COLUMN phone;

-- 添加索引
ALTER TABLE users ADD INDEX idx_email (email);

-- 删除表
DROP TABLE users;
```

### 9. 聚合函数

```sql
-- 计数
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM users WHERE age > 25;

-- 求和
SELECT SUM(age) FROM users;

-- 平均值
SELECT AVG(age) FROM users;

-- 最大值/最小值
SELECT MAX(age), MIN(age) FROM users;

-- 分组统计
SELECT age, COUNT(*) as count
FROM users
GROUP BY age;
```

### 10. 分组查询（GROUP BY）

```sql
-- 按年龄分组统计人数
SELECT age, COUNT(*) as user_count
FROM users
GROUP BY age;

-- 分组后过滤（HAVING）
SELECT age, COUNT(*) as user_count
FROM users
GROUP BY age
HAVING COUNT(*) > 5;  -- 人数大于5的年龄组

-- 多字段分组
SELECT age, city, COUNT(*)
FROM users
GROUP BY age, city;
```

`WHERE` vs `HAVING`：

-   `WHERE`：在分组前过滤行
-   `HAVING`：在分组后过滤组

### 11. 表连接（JOIN）

```sql
-- 内连接（INNER JOIN）：只返回两表都匹配的记录
SELECT u.name, o.order_id, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 左连接（LEFT JOIN）：返回左表所有记录，右表无匹配则为 NULL
SELECT u.name, o.order_id
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- 右连接（RIGHT JOIN）：返回右表所有记录，左表无匹配则为 NULL
SELECT u.name, o.order_id
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;

-- 全外连接（FULL OUTER JOIN）：返回两表所有记录（MySQL 不支持）
-- MySQL 可用 UNION 实现
```

假设两张表和部分真实数据如下：

```sql
-- 用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100)
);

INSERT INTO users (id, name) VALUES
(1, 'Alice'),
(2, 'Bob'),
(3, 'Charlie');

-- 订单表
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    amount DECIMAL(10,2)
);

INSERT INTO orders (order_id, user_id, amount) VALUES
(1, 1, 120.00),
(2, 1, 80.00),
(3, 2, 50.00),
(4, 4, 60.00);  -- 注意：user_id=4 在 users 表中不存在
```

**示例 1：内连接（INNER JOIN）——每个用户及其订单总额，只显示双方都有关联的数据**

```sql
SELECT u.name, SUM(o.amount) as total_amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id
GROUP BY u.name;
```

| name  | total_amount |
| ----- | ------------ |
| Alice | 200.00       |
| Bob   | 50.00        |

---

**示例 2：左连接（LEFT JOIN）——显示所有用户，每个用户的订单金额，没有订单的为 NULL**

```sql
SELECT u.name, o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

| name    | amount |
| ------- | ------ |
| Alice   | 120.00 |
| Alice   | 80.00  |
| Bob     | 50.00  |
| Charlie | NULL   |

---

**示例 3：右连接（RIGHT JOIN）——显示所有订单及其用户，没有用户信息的订单用户为 NULL**

```sql
SELECT u.name, o.user_id, o.amount
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
```

| name  | user_id | amount |
| ----- | ------- | ------ |
| Alice | 1       | 120.00 |
| Alice | 1       | 80.00  |
| Bob   | 2       | 50.00  |
| NULL  | 4       | 60.00  |

---

以上结果，能直观看到不同连接方式在真实数据下的效果。

### 12. 子查询（Subquery）

```sql
-- 标量子查询（返回单个值）
SELECT name FROM users
WHERE age = (SELECT MAX(age) FROM users);

-- 列子查询（返回一列）
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders WHERE amount > 100);

-- 行子查询（返回一行）
SELECT * FROM users
WHERE (age, city) = (SELECT MAX(age), 'Beijing' FROM users);

-- 表子查询（作为临时表）
SELECT u.name, o.order_count
FROM users u
JOIN (
    SELECT user_id, COUNT(*) as order_count
    FROM orders
    GROUP BY user_id
) o ON u.id = o.user_id;
```

### 13. 索引（INDEX）

索引用于提高查询速度，但会增加写入开销：

```sql
-- 创建索引
CREATE INDEX idx_email ON users(email);

-- 创建唯一索引
CREATE UNIQUE INDEX idx_email_unique ON users(email);

-- 创建复合索引
CREATE INDEX idx_age_city ON users(age, city);

-- 删除索引
DROP INDEX idx_email ON users;

-- 查看表的所有索引
SHOW INDEX FROM users;
```

索引使用建议：

-   主键自动创建索引
-   经常用于 `WHERE`、`JOIN`、`ORDER BY` 的字段创建索引
-   不要为频繁更新的字段创建过多索引
-   复合索引遵循最左前缀原则

### 14. 事务（TRANSACTION）

事务保证数据一致性，要么全部成功，要么全部失败：

```sql
-- 开始事务
START TRANSACTION;

-- 执行多个操作
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- 提交事务
COMMIT;

-- 或回滚事务（撤销所有操作）
ROLLBACK;
```

事务特性（ACID）：

-   **原子性（Atomicity）**：事务不可分割
-   **一致性（Consistency）**：数据保持一致状态
-   **隔离性（Isolation）**：事务间相互隔离
-   **持久性（Durability）**：提交后永久保存

### 15. 常用函数

```sql
-- 字符串函数
SELECT CONCAT('Hello', ' ', 'World');  -- 连接字符串
SELECT SUBSTRING('Hello', 1, 3);       -- 截取子串：'Hel'
SELECT UPPER('hello');                 -- 转大写：'HELLO'
SELECT LOWER('HELLO');                 -- 转小写：'hello'
SELECT LENGTH('Hello');                -- 字符串长度：5

-- 数值函数
SELECT ABS(-10);                       -- 绝对值：10
SELECT ROUND(3.14159, 2);              -- 四舍五入：3.14
SELECT CEIL(3.1);                      -- 向上取整：4
SELECT FLOOR(3.9);                     -- 向下取整：3

-- 日期函数
SELECT NOW();                          -- 当前日期时间
SELECT CURDATE();                      -- 当前日期
SELECT CURTIME();                      -- 当前时间
SELECT YEAR(NOW());                    -- 提取年份
SELECT MONTH(NOW());                   -- 提取月份
SELECT DATE_ADD(NOW(), INTERVAL 1 DAY); -- 日期加减

-- 条件函数
SELECT IF(age > 18, '成年', '未成年') FROM users;
SELECT CASE
    WHEN age < 18 THEN '未成年'
    WHEN age < 60 THEN '成年'
    ELSE '老年'
END as age_group FROM users;
```

### 16. 视图（VIEW）

视图是虚拟表，基于查询结果：

```sql
-- 创建视图
CREATE VIEW user_summary AS
SELECT
    u.id,
    u.name,
    COUNT(o.order_id) as order_count,
    SUM(o.amount) as total_amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- 使用视图
SELECT * FROM user_summary WHERE order_count > 5;

-- 删除视图
DROP VIEW user_summary;
```

### 17. 存储过程（Stored Procedure）

存储过程是预编译的 SQL 代码块：

```sql
-- 创建存储过程
DELIMITER //
CREATE PROCEDURE GetUserOrders(IN user_id INT)
BEGIN
    SELECT * FROM orders WHERE user_id = user_id;
END //
DELIMITER ;

-- 调用存储过程
CALL GetUserOrders(1);

-- 删除存储过程
DROP PROCEDURE GetUserOrders;
```

### 18. 常用数据库差异

**MySQL vs PostgreSQL vs SQLite：**

| 特性       | MySQL             | PostgreSQL              | SQLite            |
| ---------- | ----------------- | ----------------------- | ----------------- |
| 类型       | 关系型数据库      | 关系型数据库            | 嵌入式数据库      |
| 大小写敏感 | 表名/字段名不敏感 | 敏感                    | 敏感              |
| 字符串连接 | `CONCAT()`        | `\|\|` 或 `CONCAT()`    | `\|\|`            |
| 自增主键   | `AUTO_INCREMENT`  | `SERIAL` 或 `GENERATED` | `AUTOINCREMENT`   |
| 布尔类型   | `TINYINT(1)`      | `BOOLEAN`               | `INTEGER` (0/1)   |
| 限制查询   | `LIMIT n`         | `LIMIT n`               | `LIMIT n`         |
| 日期函数   | `NOW()`           | `NOW()`                 | `datetime('now')` |

#### 什么是嵌入式数据库？

嵌入式数据库是一种轻量级的数据库管理系统，被集成进应用程序内部（作为其一部分）而不是单独运行在服务器上。常见嵌入式数据库有 SQLite、LevelDB、RocksDB 等。

**特点：**

-   直接集成在应用中，不需要独立数据库服务进程。
-   占用资源少、部署简单，常见于移动端、桌面应用、物联网设备、小型单机程序等。
-   数据库文件一般就是一个普通文件，方便拷贝和备份。

**示例：SQLite**

-   SQLite 是最常用的嵌入式关系型数据库。
-   无需安装和配置，应用在安卓、iOS、浏览器等环境极为广泛。

```sql
-- 使用 SQLite 创建表
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER
);
```

**优点：**

-   无服务端进程，零配置
-   单一文件存储，方便携带
-   速度快，低资源消耗

**适用场景：**

-   移动 APP
-   本地桌面软件
-   需要本地缓存/存储数据的小型程序
-   物联网、嵌入式设备

**与服务器数据库的区别：**

-   服务器数据库（如 MySQL、PostgreSQL）：需单独部署、支持高并发、多用户访问、适用于企业级场景
-   嵌入式数据库：集成到应用本身，主要用于单应用、本地存储，简单可靠

### 19. 数据库设计原则

**三范式（Normalization）：**

1.  **第一范式（1NF）**：每个字段都是原子值，不可再分
2.  **第二范式（2NF）**：满足 1NF，且非主键字段完全依赖于主键
3.  **第三范式（3NF）**：满足 2NF，且非主键字段不依赖于其他非主键字段

**外键关系：**

```sql
-- 创建带外键的表
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

外键约束选项：

-   `ON DELETE CASCADE`：删除主表记录时，自动删除从表相关记录
-   `ON DELETE SET NULL`：删除主表记录时，从表外键设为 NULL
-   `ON DELETE RESTRICT`：禁止删除主表记录（默认）

### 20. 性能优化建议

```sql
-- 1. 使用索引
CREATE INDEX idx_email ON users(email);

-- 2. 避免 SELECT *
SELECT id, name FROM users;  -- 而不是 SELECT *

-- 3. 使用 LIMIT 限制结果
SELECT * FROM users LIMIT 100;

-- 4. 避免在 WHERE 子句中使用函数
-- 不好：WHERE YEAR(created_at) = 2024
-- 好：WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'

// - WHERE 使用函数 → 索引失效 → 查询慢
// - WHERE 直接比较 → 可以用索引 → 查询快


-- 5. 使用 EXPLAIN 分析查询
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- 6. 合理使用 JOIN，避免子查询（通常 JOIN 更快）
```

### 推荐学习顺序

1.  **基础语法**：掌握 `SELECT`、`INSERT`、`UPDATE`、`DELETE` 四大基本操作
2.  **表操作**：学会 `CREATE TABLE`、`ALTER TABLE`、`DROP TABLE`
3.  **查询进阶**：掌握 `WHERE`、`ORDER BY`、`GROUP BY`、`HAVING`、聚合函数
4.  **表连接**：理解 `INNER JOIN`、`LEFT JOIN` 等连接方式
5.  **子查询**：学会使用子查询解决复杂问题
6.  **索引和性能**：了解索引的作用和创建方法，掌握基本性能优化
7.  **事务**：理解事务的概念和 ACID 特性
8.  **数据库设计**：学习范式理论和外键关系设计

掌握以上内容即可参与数据库相关的项目开发。建议通过实际项目练习，加深理解。详见 [MySQL 官方文档](https://dev.mysql.com/doc/) 或 [PostgreSQL 官方文档](https://www.postgresql.org/docs/)。
