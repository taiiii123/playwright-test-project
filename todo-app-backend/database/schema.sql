-- ===================================
-- Todo アプリケーション データベース
-- ===================================

-- データベースの作成
CREATE DATABASE IF NOT EXISTS todoapp
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE todoapp;

-- ===================================
-- テーブル: users
-- ユーザー情報を管理
-- ===================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ユーザーID（主キー）',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'ユーザー名（ログイン用、一意）',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT 'メールアドレス（一意）',
    password VARCHAR(255) NOT NULL COMMENT 'パスワード（BCryptハッシュ化）',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '作成日時',
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新日時',
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ユーザー情報テーブル';

-- ===================================
-- テーブル: todos
-- Todo情報を管理
-- ===================================
CREATE TABLE IF NOT EXISTS todos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'TodoID（主キー）',
    title VARCHAR(255) NOT NULL COMMENT 'Todoのタイトル',
    description TEXT COMMENT 'Todoの詳細説明',
    completed BOOLEAN NOT NULL DEFAULT FALSE COMMENT '完了フラグ（FALSE:未完了、TRUE:完了）',
    user_id BIGINT NOT NULL COMMENT 'ユーザーID（外部キー）',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '作成日時',
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新日時',
    
    CONSTRAINT fk_todos_user FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_completed (completed),
    INDEX idx_created_at (created_at),
    INDEX idx_user_completed (user_id, completed),
    INDEX idx_user_created (user_id, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Todo情報テーブル';

-- ===================================
-- サンプルデータの投入
-- ===================================
-- 注: サンプルデータはtest_data.sqlで管理しています

-- ===================================
-- テーブル情報の確認
-- ===================================
SHOW TABLES;
DESCRIBE users;
DESCRIBE todos;
