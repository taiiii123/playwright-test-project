# データベース設計書

## データベース概要

- **データベース名**: `tododb`
- **文字コード**: `utf8mb4`
- **照合順序**: `utf8mb4_unicode_ci`
- **ストレージエンジン**: InnoDB

## ER図（テキスト表現）

```
┌─────────────────┐         ┌─────────────────┐
│     users       │         │     todos       │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │─────┐   │ id (PK)         │
│ username        │     └──<│ user_id (FK)    │
│ email           │         │ title           │
│ password        │         │ description     │
│ created_at      │         │ completed       │
│ updated_at      │         │ created_at      │
└─────────────────┘         │ updated_at      │
                            └─────────────────┘

リレーション: users (1) ─< (N) todos
```

## テーブル定義

### 1. users テーブル

**概要**: ユーザー情報を管理するテーブル

| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|---------|---------|------|------------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | - | ユーザーID（主キー） |
| username | VARCHAR(50) | NOT NULL, UNIQUE | - | ユーザー名（ログイン用） |
| email | VARCHAR(100) | NOT NULL, UNIQUE | - | メールアドレス |
| password | VARCHAR(255) | NOT NULL | - | パスワード（BCryptハッシュ化） |
| created_at | DATETIME(6) | NOT NULL | CURRENT_TIMESTAMP(6) | 作成日時 |
| updated_at | DATETIME(6) | NOT NULL | CURRENT_TIMESTAMP(6) | 更新日時（自動更新） |

**インデックス**:
- PRIMARY KEY: `id`
- UNIQUE INDEX: `username`
- UNIQUE INDEX: `email`
- INDEX: `idx_username` (username)
- INDEX: `idx_email` (email)
- INDEX: `idx_created_at` (created_at)

**備考**:
- パスワードは BCrypt アルゴリズムでハッシュ化されて保存
- username と email は一意制約により重複不可
- created_at は自動的に現在時刻が設定される
- updated_at は更新時に自動的に現在時刻に更新される

---

### 2. todos テーブル

**概要**: Todo情報を管理するテーブル

| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|---------|---------|------|------------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | - | TodoID（主キー） |
| title | VARCHAR(255) | NOT NULL | - | Todoのタイトル |
| description | TEXT | NULL | - | Todoの詳細説明（任意） |
| completed | BOOLEAN | NOT NULL | FALSE | 完了フラグ |
| user_id | BIGINT | NOT NULL, FOREIGN KEY | - | ユーザーID（外部キー） |
| created_at | DATETIME(6) | NOT NULL | CURRENT_TIMESTAMP(6) | 作成日時 |
| updated_at | DATETIME(6) | NOT NULL | CURRENT_TIMESTAMP(6) | 更新日時（自動更新） |

**インデックス**:
- PRIMARY KEY: `id`
- INDEX: `idx_user_id` (user_id) - ユーザーごとのTodo検索を高速化
- INDEX: `idx_completed` (completed) - 完了/未完了でのフィルタリングを高速化
- INDEX: `idx_created_at` (created_at) - 作成日時での並び替えを高速化
- COMPOSITE INDEX: `idx_user_completed` (user_id, completed) - ユーザー＋完了状態での検索を高速化
- COMPOSITE INDEX: `idx_user_created` (user_id, created_at DESC) - ユーザーごとの新着順取得を高速化

**外部キー制約**:
```sql
CONSTRAINT fk_todos_user 
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
```

**備考**:
- user_id は users テーブルの id を参照
- ユーザーが削除されると、そのユーザーの Todo も自動的に削除される（CASCADE）
- completed のデフォルト値は FALSE（未完了）
- description は NULL 許可（任意項目）

---

## インデックス戦略

### users テーブル

1. **主キーインデックス** (id)
   - 目的: 行の一意識別
   - 自動作成

2. **ユニークインデックス** (username, email)
   - 目的: 重複チェック、ログイン時の検索
   - パフォーマンス: O(log n)

3. **作成日時インデックス** (created_at)
   - 目的: 登録日順での並び替え
   - 使用頻度: 中

### todos テーブル

1. **主キーインデックス** (id)
   - 目的: 行の一意識別
   - 自動作成

2. **ユーザーIDインデックス** (user_id)
   - 目的: 特定ユーザーの Todo 一覧取得
   - 使用頻度: 非常に高い
   - クエリ例: `SELECT * FROM todos WHERE user_id = ?`

3. **完了フラグインデックス** (completed)
   - 目的: 完了/未完了でのフィルタリング
   - 使用頻度: 高い
   - クエリ例: `SELECT * FROM todos WHERE completed = FALSE`

4. **複合インデックス** (user_id, completed)
   - 目的: ユーザーごとの完了/未完了Todo取得
   - 使用頻度: 非常に高い
   - クエリ例: `SELECT * FROM todos WHERE user_id = ? AND completed = FALSE`

5. **複合インデックス** (user_id, created_at DESC)
   - 目的: ユーザーごとの新着順Todo取得
   - 使用頻度: 非常に高い
   - クエリ例: `SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC`

---

## データ型の選択理由

| データ型 | 使用箇所 | 理由 |
|---------|---------|------|
| BIGINT | id, user_id | 大量のレコードに対応（最大 2^63-1）|
| VARCHAR(50) | username | 一般的なユーザー名の長さに対応 |
| VARCHAR(100) | email | メールアドレスの最大長に対応 |
| VARCHAR(255) | password, title | BCryptハッシュ（60文字）とタイトルに十分 |
| TEXT | description | 長い説明文に対応 |
| BOOLEAN | completed | 真偽値（0 or 1） |
| DATETIME(6) | created_at, updated_at | ミリ秒精度のタイムスタンプ |

---

## クエリパフォーマンス最適化

### よく使われるクエリとインデックスの関係

1. **ユーザーのTodo一覧取得（新着順）**
```sql
SELECT * FROM todos 
WHERE user_id = ? 
ORDER BY created_at DESC;
```
→ 使用インデックス: `idx_user_created`

2. **ユーザーの未完了Todo一覧**
```sql
SELECT * FROM todos 
WHERE user_id = ? AND completed = FALSE;
```
→ 使用インデックス: `idx_user_completed`

3. **ユーザー名でログイン**
```sql
SELECT * FROM users WHERE username = ?;
```
→ 使用インデックス: UNIQUE INDEX on `username`

4. **特定Todoの更新**
```sql
UPDATE todos 
SET completed = TRUE, updated_at = NOW() 
WHERE id = ? AND user_id = ?;
```
→ 使用インデックス: PRIMARY KEY on `id`

---

## セキュリティ考慮事項

1. **パスワード保護**
   - BCrypt アルゴリズムでハッシュ化
   - ソルト自動生成
   - ラウンド数: 10（デフォルト）

2. **外部キー制約**
   - CASCADE DELETE: ユーザー削除時に関連Todoも削除
   - データ整合性を保証

3. **インジェクション対策**
   - JPA/Hibernate のパラメータバインディングを使用
   - プリペアドステートメント

4. **アクセス制御**
   - user_id による所有権チェック
   - ユーザーは自分のTodoのみアクセス可能

---

## 容量見積もり

### users テーブル

| 項目 | サイズ |
|-----|-------|
| 1レコードあたり | 約 500 bytes |
| 10,000 ユーザー | 約 5 MB |
| 100,000 ユーザー | 約 50 MB |

### todos テーブル

| 項目 | サイズ |
|-----|-------|
| 1レコードあたり | 約 1 KB（description含む） |
| ユーザーあたり平均 50 Todo | - |
| 10,000 ユーザー × 50 Todo | 約 500 MB |
| 100,000 ユーザー × 50 Todo | 約 5 GB |

---

## バックアップ戦略

### 推奨バックアップ方法

1. **フルバックアップ**: 毎日深夜に実行
```bash
mysqldump -u root -p tododb > backup_$(date +%Y%m%d).sql
```

2. **差分バックアップ**: バイナリログを有効化
```sql
SET GLOBAL log_bin = ON;
```

3. **リストア手順**
```bash
mysql -u root -p tododb < backup_20241119.sql
```

---

## メンテナンス

### 定期的な最適化

```sql
-- テーブルの最適化
OPTIMIZE TABLE users;
OPTIMIZE TABLE todos;

-- インデックスの再構築
ALTER TABLE todos DROP INDEX idx_user_created;
ALTER TABLE todos ADD INDEX idx_user_created (user_id, created_at DESC);

-- 統計情報の更新
ANALYZE TABLE users;
ANALYZE TABLE todos;
```

### パフォーマンス監視

```sql
-- スロークエリの確認
SHOW VARIABLES LIKE 'slow_query_log%';

-- インデックス使用状況
SHOW INDEX FROM todos;

-- テーブルサイズの確認
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size (MB)"
FROM information_schema.TABLES
WHERE table_schema = 'tododb';
```
