-- MySQL数据库建表脚本
-- 适用于Koodo Reader应用

CREATE DATABASE IF NOT EXISTS `koodo_reader` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `koodo_reader`;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin','user','guest') NOT NULL DEFAULT 'user',
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 会话表
CREATE TABLE IF NOT EXISTS `session` (
  `id` CHAR(36) PRIMARY KEY,
  `token` VARCHAR(512) NOT NULL UNIQUE,
  `expiresAt` DATETIME NOT NULL,
  `userId` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 其他表结构请根据实际模型补充

-- 初始化管理员账户
INSERT IGNORE INTO `user` (`username`, `password`, `role`, `createdAt`, `updatedAt`)
VALUES ('admin', '$2b$10$N9qo8uLOickgx2ZMRZoMy.MQRv/QX6w/eejjS5B.7U1tHp2g/1x.C', 'admin', NOW(), NOW());