# MySQL データベースセットアップ手順

## 前提条件

- MySQL 8.0 以上がインストールされている
- MySQL サーバーが起動している
- root ユーザーまたは適切な権限を持つユーザーでアクセス可能

## セットアップ手順

### 1. MySQL にログイン

```bash
mysql -u root -p
```

パスワードを入力してログインします。

### 2. データベースの作成

```sql
CREATE DATABASE IF NOT EXISTS tododb
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

### 3. データベースユーザーの作成（オプション）

アプリケーション専用のユーザーを作成する場合:

```sql
-- ユーザーの作成
CREATE USER 'todoapp'@'localhost' IDENTIFIED BY 'your_secure_password';

-- 権限の付与
GRANT ALL PRIVILEGES ON tododb.* TO 'todoapp'@'localhost';

-- 権限の反映
FLUSH PRIVILEGES;
```

### 4. データベーススキーマの適用

#### 方法1: SQLファイルから実行

```bash
mysql -u root -p tododb < database/schema.sql
```

#### 方法2: MySQL内で実行

```sql
USE tododb;
SOURCE /path/to/database/schema.sql;
```

#### 方法3: Spring Boot の自動マイグレーション

`application.yml` で `ddl-auto: update` が設定されている場合、
アプリケーション起動時に自動的にテーブルが作成されます。

### 5. テーブルの確認

```sql
USE tododb;
SHOW TABLES;
DESCRIBE users;
DESCRIBE todos;
```

期待される出力:
```
+------------------+
| Tables_in_tododb |
+------------------+
| todos            |
| users            |
+------------------+
```

### 6. application.yml の設定

Spring Boot の設定ファイルを確認・編集します:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/tododb?useSSL=false&serverTimezone=Asia/Tokyo&allowPublicKeyRetrieval=true&characterEncoding=UTF-8
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root  # または作成したユーザー名
    password: root  # 実際のパスワードに変更
```

**重要**: `username` と `password` は実際の環境に合わせて変更してください。

## トラブルシューティング

### エラー: Access denied for user

**原因**: パスワードが間違っているか、ユーザーに権限がない

**解決策**:
```sql
-- パスワードのリセット（root権限が必要）
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### エラー: Unknown database 'tododb'

**原因**: データベースが作成されていない

**解決策**:
```sql
CREATE DATABASE tododb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### エラー: Table 'tododb.users' doesn't exist

**原因**: テーブルが作成されていない

**解決策**:
- `schema.sql` を実行する
- または Spring Boot アプリケーションを起動して自動作成させる

### 接続エラー: Communications link failure

**原因**: MySQL サーバーが起動していない、またはポートが違う

**解決策**:
```bash
# MySQL サーバーの状態確認
sudo systemctl status mysql

# MySQL サーバーの起動
sudo systemctl start mysql

# ポート確認
netstat -an | grep 3306
```

### 文字コードエラー

**原因**: MySQL の文字コード設定が utf8mb4 になっていない

**解決策**:
```sql
-- 現在の設定確認
SHOW VARIABLES LIKE 'character%';
SHOW VARIABLES LIKE 'collation%';

-- my.cnf または my.ini に追記
[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci

[client]
default-character-set=utf8mb4
```

## セキュリティ設定

### 1. 本番環境用のユーザー作成

```sql
-- 読み取り専用ユーザー（分析用）
CREATE USER 'todoapp_ro'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT ON tododb.* TO 'todoapp_ro'@'localhost';

-- アプリケーション用ユーザー（読み書き可能）
CREATE USER 'todoapp_rw'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON tododb.* TO 'todoapp_rw'@'localhost';

FLUSH PRIVILEGES;
```

### 2. リモートアクセスの設定（必要な場合のみ）

```sql
-- 特定IPからのアクセスを許可
CREATE USER 'todoapp'@'192.168.1.100' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON tododb.* TO 'todoapp'@'192.168.1.100';

-- 全てのIPからのアクセスを許可（非推奨）
CREATE USER 'todoapp'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON tododb.* TO 'todoapp'@'%';

FLUSH PRIVILEGES;
```

### 3. パスワードポリシーの確認

```sql
SHOW VARIABLES LIKE 'validate_password%';
```

## バックアップ

### データベース全体のバックアップ

```bash
# バックアップ作成
mysqldump -u root -p tododb > tododb_backup_$(date +%Y%m%d_%H%M%S).sql

# 圧縮してバックアップ
mysqldump -u root -p tododb | gzip > tododb_backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### 特定テーブルのバックアップ

```bash
mysqldump -u root -p tododb users > users_backup.sql
mysqldump -u root -p tododb todos > todos_backup.sql
```

### リストア

```bash
# 通常のバックアップからリストア
mysql -u root -p tododb < tododb_backup_20241119.sql

# 圧縮バックアップからリストア
gunzip < tododb_backup_20241119.sql.gz | mysql -u root -p tododb
```

## パフォーマンスチューニング

### インデックスの確認

```sql
USE tododb;
SHOW INDEX FROM users;
SHOW INDEX FROM todos;
```

### スロークエリログの有効化

```sql
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;  -- 2秒以上かかるクエリをログに記録
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow-query.log';
```

### クエリキャッシュの設定（MySQL 5.7以前）

```sql
-- MySQL 8.0 ではクエリキャッシュは廃止されました
-- 代わりに適切なインデックスを設定してください
```

## モニタリング

### データベースサイズの確認

```sql
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'tododb'
GROUP BY table_schema;
```

### テーブルごとのサイズ

```sql
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)',
    table_rows AS 'Rows'
FROM information_schema.TABLES
WHERE table_schema = 'tododb'
ORDER BY (data_length + index_length) DESC;
```

### 接続数の確認

```sql
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Threads_connected';
SHOW VARIABLES LIKE 'max_connections';
```

## 定期メンテナンス

### 毎週実行

```sql
-- テーブルの最適化
OPTIMIZE TABLE users;
OPTIMIZE TABLE todos;

-- 統計情報の更新
ANALYZE TABLE users;
ANALYZE TABLE todos;
```

### 毎月実行

```sql
-- インデックスの再構築
ALTER TABLE todos ENGINE=InnoDB;
ALTER TABLE users ENGINE=InnoDB;
```

## 環境別設定

### 開発環境

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/tododb_dev
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update  # 開発中は自動マイグレーション
    show-sql: true      # SQLログを表示
```

### ステージング環境

```yaml
spring:
  datasource:
    url: jdbc:mysql://staging-db-server:3306/tododb_staging
    username: todoapp_rw
    password: ${DB_PASSWORD}  # 環境変数から取得
  jpa:
    hibernate:
      ddl-auto: validate  # スキーマ変更は手動で
    show-sql: false
```

### 本番環境

```yaml
spring:
  datasource:
    url: jdbc:mysql://prod-db-server:3306/tododb
    username: todoapp_rw
    password: ${DB_PASSWORD}  # 環境変数から取得
    hikari:
      maximum-pool-size: 20
      minimum-idle: 10
  jpa:
    hibernate:
      ddl-auto: validate  # 絶対に none または validate
    show-sql: false
    properties:
      hibernate:
        generate_statistics: false
```

## まとめ

1. データベース作成
2. ユーザー作成（オプション）
3. スキーマ適用
4. application.yml 設定
5. アプリケーション起動
6. 動作確認

問題が発生した場合は、トラブルシューティングセクションを参照してください。
