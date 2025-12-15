# Todo アプリ - バックエンド

Spring Boot + Spring Security + JWT で構築された Todo アプリケーションのバックエンド API です。

## 機能

- JWT 認証（ユーザー登録・ログイン）
- Todo の CRUD 操作
- ユーザーごとの Todo 管理
- セキュアな API エンドポイント

## 技術スタック

- **Spring Boot 3.2.0**: フレームワーク
- **Spring Security**: 認証・認可
- **Spring Data JPA**: データベースアクセス
- **JWT (JSON Web Token)**: トークンベース認証
- **H2 Database**: 開発用インメモリDB
- **MySQL**: 本番用データベース（オプション）
- **Lombok**: ボイラープレートコード削減
- **Maven**: ビルドツール

## プロジェクト構成

```
src/main/java/com/example/todoapp/
├── config/              # 設定クラス
│   └── SecurityConfig.java
├── controller/          # REST コントローラー
│   ├── AuthController.java
│   └── TodoController.java
├── dto/                 # データ転送オブジェクト
│   ├── AuthDTO.java
│   └── TodoDTO.java
├── exception/           # 例外ハンドラー
│   └── GlobalExceptionHandler.java
├── model/               # エンティティクラス
│   ├── User.java
│   └── Todo.java
├── repository/          # データベースアクセス
│   ├── UserRepository.java
│   └── TodoRepository.java
├── security/            # セキュリティ関連
│   ├── JwtUtil.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
├── service/             # ビジネスロジック
│   ├── AuthService.java
│   └── TodoService.java
└── TodoAppApplication.java  # メインクラス
```

## セットアップ

### 前提条件

- Java 17 以上
- Maven 3.6 以上
- MySQL 8.0 以上（本番環境の場合）

### 1. プロジェクトのビルド

```bash
mvn clean install
```

### 2. アプリケーションの起動

**H2データベース（開発用）を使用する場合:**

```bash
mvn spring-boot:run
```

**MySQLを使用する場合:**

1. `src/main/resources/application.yml` を編集:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/tododb?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: your_username
    password: your_password
  jpa:
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
```

2. MySQLでデータベースを作成:

```sql
CREATE DATABASE tododb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. アプリケーションを起動:

```bash
mvn spring-boot:run
```

アプリケーションは http://localhost:8080 で起動します。

## API エンドポイント

### 認証 API

#### ユーザー登録
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "testuser",
  "email": "test@example.com"
}
```

#### ログイン
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "testuser",
  "email": "test@example.com"
}
```

### Todo API（認証が必要）

すべての Todo API リクエストには、Authorization ヘッダーに Bearer トークンを付与する必要があります:

```
Authorization: Bearer {token}
```

#### Todo 一覧取得
```http
GET /api/todos
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "title": "買い物",
    "description": "牛乳を買う",
    "completed": false,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
]
```

#### Todo 作成
```http
POST /api/todos
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "買い物",
  "description": "牛乳を買う",
  "completed": false
}

Response:
{
  "id": 1,
  "title": "買い物",
  "description": "牛乳を買う",
  "completed": false,
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

#### Todo 更新
```http
PUT /api/todos/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "買い物（更新）",
  "description": "牛乳とパンを買う",
  "completed": true
}
```

#### Todo 削除
```http
DELETE /api/todos/{id}
Authorization: Bearer {token}

Response:
{
  "message": "Todoが削除されました"
}
```

#### Todo 完了状態切替
```http
PATCH /api/todos/{id}/toggle
Authorization: Bearer {token}

Response:
{
  "id": 1,
  "title": "買い物",
  "description": "牛乳を買う",
  "completed": true,
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:30:00"
}
```

## データベース

### H2 コンソール（開発用）

H2 コンソールにアクセス: http://localhost:8080/h2-console

- JDBC URL: `jdbc:h2:mem:tododb`
- Username: `sa`
- Password: (空白)

### テーブル構造

#### users テーブル
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);
```

#### todos テーブル
```sql
CREATE TABLE todos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## セキュリティ

- パスワードは BCrypt でハッシュ化されて保存
- JWT トークンの有効期限は 24 時間
- CORS 設定により http://localhost:3000 からのアクセスを許可
- すべての Todo API は認証が必要

## テスト

```bash
mvn test
```

## ビルド

```bash
mvn clean package
```

ビルド後の JAR ファイルは `target/todo-app-backend-1.0.0.jar` に生成されます。

## 実行（JAR ファイルから）

```bash
java -jar target/todo-app-backend-1.0.0.jar
```

## トラブルシューティング

### ポート競合
ポート 8080 が既に使用されている場合は、`application.yml` でポートを変更:

```yaml
server:
  port: 8081
```

### MySQL 接続エラー
- MySQL サーバーが起動していることを確認
- データベースが作成されていることを確認
- ユーザー名・パスワードが正しいことを確認
