# テストアカウント情報

## 📝 テストユーザー一覧

システムに用意されているテストアカウントです。

### ユーザー1: testuser

| 項目 | 値 |
|-----|-----|
| **ユーザー名** | `testuser` |
| **パスワード** | `password123` |
| **メールアドレス** | test@example.com |
| **用途** | 一般的なテスト用 |

### ユーザー2: demo

| 項目 | 値 |
|-----|-----|
| **ユーザー名** | `demo` |
| **パスワード** | `demo1234` |
| **メールアドレス** | demo@example.com |
| **用途** | デモンストレーション用 |

### ユーザー3: admin

| 項目 | 値 |
|-----|-----|
| **ユーザー名** | `admin` |
| **パスワード** | `admin123` |
| **メールアドレス** | admin@example.com |
| **用途** | 管理者テスト用 |

---

## 🚀 テストデータの投入方法

### MySQL コマンドラインから

```bash
mysql -u root -p tododb < database/test_data.sql
```

### MySQL Workbench や phpMyAdmin から

1. `database/test_data.sql` ファイルを開く
2. SQL を実行

### コマンド実行後の確認

```sql
USE tododb;
SELECT username, email FROM users;
```

---

## 🔐 パスワードハッシュについて

上記のパスワードは BCrypt でハッシュ化されています：

| 平文パスワード | BCrypt ハッシュ |
|---------------|----------------|
| `password123` | `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy` |
| `demo1234` | `$2a$10$8VqEwN5K8DuOuZ0LbqLVmOLW5BXZVDZVqxj6jmPQlKJhHQX5rr7MG` |
| `admin123` | `$2a$10$mX.N8JKVNlVqN8B5MHPPPeKH/Z7P3RVp0vH7J3YLHZqQGJxqN6YXO` |

---

## 📱 フロントエンドでのログイン

### ステップ1: アプリケーションを開く

```
http://localhost:3000/login
```

### ステップ2: ログイン情報を入力

- **ユーザー名**: `testuser`
- **パスワード**: `password123`

### ステップ3: ログインボタンをクリック

成功すると Todo 一覧画面に遷移します。

---

## 🧪 API での動作確認

### 1. ユーザー登録（新規ユーザーを作成する場合）

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123"
  }'
```

### 2. ログイン

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

レスポンス例：
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTYzNzI0NjQwMCwiZXhwIjoxNjM3MzMyODAwfQ.xxxxx",
  "username": "testuser",
  "email": "test@example.com"
}
```

### 3. Todo 一覧取得（認証が必要）

```bash
# 上記で取得した token を使用
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx"

curl -X GET http://localhost:8080/api/todos \
  -H "Authorization: Bearer ${TOKEN}"
```

### 4. Todo 作成

```bash
curl -X POST http://localhost:8080/api/todos \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新しいTodo",
    "description": "これはテストです",
    "completed": false
  }'
```

---

## ⚠️ セキュリティ注意事項

### 開発環境

- 上記のテストアカウントは**開発・テスト環境専用**です
- 簡易的なパスワードなので、本番環境では使用しないでください

### 本番環境

1. **テストデータを削除**
   ```sql
   DELETE FROM todos;
   DELETE FROM users WHERE username IN ('testuser', 'demo', 'admin');
   ```

2. **強力なパスワードを使用**
   - 最低12文字以上
   - 大文字・小文字・数字・記号を含む

3. **環境変数で管理**
   ```yaml
   spring:
     datasource:
       username: ${DB_USERNAME}
       password: ${DB_PASSWORD}
   jwt:
     secret: ${JWT_SECRET}
   ```

---

## 🔄 パスワードの変更方法

テストユーザーのパスワードを変更したい場合：

### 方法1: SQL で直接更新

```sql
-- 新しいパスワードのハッシュを生成する必要があります
-- BCrypt オンラインツールを使用: https://bcrypt-generator.com/
-- または Spring Boot アプリケーション内で生成

UPDATE users 
SET password = '$2a$10$新しいハッシュ' 
WHERE username = 'testuser';
```

### 方法2: アプリケーションから変更

パスワード変更機能を実装する場合は、新しいエンドポイントを追加します。

---

## 🎯 クイックスタート

**最速でテストを開始する手順：**

1. データベースを作成
   ```bash
   mysql -u root -p -e "CREATE DATABASE tododb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

2. スキーマを適用
   ```bash
   mysql -u root -p tododb < database/schema.sql
   ```

3. テストデータを投入
   ```bash
   mysql -u root -p tododb < database/test_data.sql
   ```

4. バックエンド起動
   ```bash
   mvn spring-boot:run
   ```

5. フロントエンド起動
   ```bash
   cd ../todo-app-frontend
   npm install
   npm run dev
   ```

6. ブラウザで開く
   ```
   http://localhost:3000/login
   ```

7. ログイン
   - ユーザー名: `testuser`
   - パスワード: `password123`

これで完了です！ 🎉
