-- ============================================
-- Yjs 多人协同编辑系统 - MySQL 数据库初始化脚本
-- ============================================

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS `yjs_db` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE `yjs_db`;

-- 创建文档存储表
CREATE TABLE IF NOT EXISTS `yjs_documents` (
    `doc_name` VARCHAR(255) NOT NULL COMMENT '文档名称',
    `update_data` LONGBLOB NOT NULL COMMENT 'Yjs 文档状态数据（二进制）',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
    PRIMARY KEY (`doc_name`),
    INDEX `idx_updated_at` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Yjs 文档持久化存储表';

-- 创建用户（可选，用于生产环境）
-- CREATE USER IF NOT EXISTS 'yjs_user'@'localhost' IDENTIFIED BY 'your_password_here';
-- GRANT ALL PRIVILEGES ON yjs_db.* TO 'yjs_user'@'localhost';
-- FLUSH PRIVILEGES;

-- 显示表结构
DESCRIBE `yjs_documents`;

-- 显示创建表的 SQL
SHOW CREATE TABLE `yjs_documents`;

SELECT '✅ 数据库初始化完成！' AS message;

