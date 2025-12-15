-- ===================================
-- テストユーザーの作成
-- ===================================

USE todoapp;

-- テストユーザー1
-- ユーザー名: testuser
-- パスワード: password123
INSERT IGNORE INTO users (username, email, password, created_at, updated_at) VALUES
('testuser', 'test@example.com', '$2a$10$tBrgoyGhNSqDvaLrAhwbQ.9XJ1Yzz6YbMDZgQbj2mlMEDQFEHUwYG', NOW(), NOW());

-- テストユーザー2
-- ユーザー名: demo
-- パスワード: demo1234
INSERT IGNORE INTO users (username, email, password, created_at, updated_at) VALUES
('demo', 'demo@example.com', '$2a$10$doenpbxSSuGWOwmpy/68YupOWKNLnuB0gJhTd1NbYfPnyFv43kgQW', NOW(), NOW());

-- テストユーザー3
-- ユーザー名: admin
-- パスワード: admin123
INSERT IGNORE INTO users (username, email, password, created_at, updated_at) VALUES
('admin', 'admin@example.com', '$2a$10$fHBmbMCiDUGo6SREOhEoqeDAT2cQbDrOF7yfuq1wDiVZ72biWBqFK', NOW(), NOW());

-- サンプルTodoデータ（オプション）
-- testuser のTodo
INSERT IGNORE INTO todos (title, description, completed, user_id, created_at, updated_at) VALUES
('買い物', '牛乳、パン、卵を買う', FALSE, (SELECT id FROM users WHERE username = 'testuser'), NOW(), NOW()),
('勉強', 'Spring Bootの勉強をする', FALSE, (SELECT id FROM users WHERE username = 'testuser'), NOW(), NOW()),
('運動', 'ジョギング30分', TRUE, (SELECT id FROM users WHERE username = 'testuser'), NOW(), NOW()),
('読書', '技術書を読む', FALSE, (SELECT id FROM users WHERE username = 'testuser'), NOW(), NOW());

-- demo のTodo
INSERT IGNORE INTO todos (title, description, completed, user_id, created_at, updated_at) VALUES
('会議準備', 'プレゼン資料作成', FALSE, (SELECT id FROM users WHERE username = 'demo'), NOW(), NOW()),
('メール返信', '顧客からのメールに返信', TRUE, (SELECT id FROM users WHERE username = 'demo'), NOW(), NOW());

SELECT '✅ テストユーザーが作成されました！' AS status;
SELECT username, email FROM users;
