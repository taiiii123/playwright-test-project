# Todo アプリ - フロントエンド

Vue 3 + TypeScript + Vite で構築された Todo アプリケーションのフロントエンドです。

## 機能

- ユーザー認証（ログイン・新規登録）
- Todo の CRUD 操作
- Todo のフィルタリング（すべて・未完了・完了）
- JWT トークンによる認証管理
- レスポンシブデザイン

## 技術スタック

- **Vue 3**: Composition API
- **TypeScript**: 型安全性
- **Vite**: 高速ビルドツール
- **Vue Router**: ルーティング
- **Pinia**: 状態管理
- **Axios**: HTTP クライアント

## プロジェクト構成

```
src/
├── api/           # API 通信モジュール
│   ├── auth.ts    # 認証 API
│   └── todo.ts    # Todo API
├── stores/        # Pinia ストア
│   ├── auth.ts    # 認証ストア
│   └── todo.ts    # Todo ストア
├── views/         # ページコンポーネント
│   ├── Login.vue
│   ├── Register.vue
│   └── TodoList.vue
├── router/        # ルーティング設定
│   └── index.ts
├── App.vue        # ルートコンポーネント
└── main.ts        # エントリーポイント
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは http://localhost:3000 で起動します。

### 3. ビルド

```bash
npm run build
```

## API エンドポイント

バックエンドは http://localhost:8080 で起動している必要があります。

### 認証

- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン

### Todo

- `GET /api/todos` - Todo 一覧取得
- `POST /api/todos` - Todo 作成
- `PUT /api/todos/:id` - Todo 更新
- `DELETE /api/todos/:id` - Todo 削除
- `PATCH /api/todos/:id/toggle` - Todo 完了状態切替

## 認証フロー

1. ユーザーがログイン/登録
2. サーバーから JWT トークンを取得
3. トークンを localStorage に保存
4. 以降の API リクエストに Bearer トークンとして付与
5. 401 エラー時は自動的にログイン画面へリダイレクト

## 環境変数

必要に応じて `.env` ファイルを作成:

```
VITE_API_BASE_URL=http://localhost:8080
```
