# Playwright テストスイート

このディレクトリには、TodoアプリケーションのPlaywright E2Eテストが含まれています。

## 📁 プロジェクト構造

```
playwright/
├── tests/
│   ├── specs/                     # テストファイル
│   │   ├── 00_example.spec.js    # サンプルテスト
│   │   ├── 01_auth.spec.js       # 認証機能のテスト
│   │   ├── 02_todo-crud.spec.js  # Todo CRUD操作のテスト
│   │   └── 03_todo-filter.spec.js # Todoフィルタリング機能のテスト
│   ├── helpers/                   # テストヘルパー関数
│   │   ├── database.js           # データベースヘルパー
│   │   └── evidence.js           # 自動スクリーンショットヘルパー
│   ├── data/                     # テストデータ
│   │   └── sql/                  # SQLファイル
│   │       ├── cleanup/          # クリーンアップSQL
│   │       ├── setup/            # セットアップSQL
│   │       └── login-test/       # ログインテスト用SQL
│   └── global-setup.js           # グローバルセットアップ
├── screenshots/                   # テスト実行時のスクリーンショット（自動生成）
├── playwright.config.js          # Playwright設定ファイル
├── cleanup-db.js                 # データベースクリーンアップスクリプト
├── package.json                  # 依存関係とスクリプト
├── .env                          # 環境変数設定
├── DATABASE_CLEANUP.md           # クリーンアップガイド
└── README.md                     # このファイル
```

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
cd playwright
npm install
```

### 2. Playwrightブラウザのインストール

```bash
npm run install:browsers
```

### 3. 環境変数の設定

`.env`ファイルが正しく設定されていることを確認してください：

```env
BASE_URL=http://localhost

# DB接続設定
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=todoapp
DB_PORT=3309

# SQLファイルのパス
SQL_PATH=tests/data/sql
```

### 4. アプリケーションの起動

テストを実行する前に、Docker環境でアプリケーションを起動してください：

```bash
cd ..
docker-compose up -d
```

アプリケーションが以下のURLで利用可能になります：
- **フロントエンド**: http://localhost
- **バックエンドAPI**: http://localhost:8080
- **MySQL**: localhost:3309

## 🧪 テストの実行

### 基本コマンド

```bash
# すべてのテストを実行（ヘッドレスモード）
npm test

# ブラウザを表示してテストを実行
npm run test:headed

# Playwright UIモードでテストを実行（推奨）
npm run test:ui

# デバッグモードでテストを実行
npm run test:debug
```

### 特定のテストスイートを実行

```bash
# 認証テストのみ実行
npm run test:auth

# Todoテストのみ実行
npm run test:todos
```

### ブラウザ別にテストを実行

```bash
# Chromiumのみ
npm run test:chrome

# Firefoxのみ
npm run test:firefox

# WebKitのみ
npm run test:webkit

# すべてのブラウザで実行
npm run test:all-browsers
```

## 🧹 データベースクリーンアップ

テスト実行時、データベースに新規ユーザーやTodoデータが蓄積されます。

### 自動クリーンアップ

テスト実行前に自動的にクリーンアップが行われます：

```bash
npm test
# 出力例：
# 🧹 テスト実行前にデータベースをクリーンアップします...
# ✅ クリーンアップが完了しました
```

### 手動クリーンアップ

必要に応じて手動でクリーンアップできます：

```bash
npm run cleanup
```

詳細は `DATABASE_CLEANUP.md` を参照してください。

## 📊 レポートとデバッグ

### HTMLレポートを表示

```bash
npm run report
```

### トレースビューアを使用

```bash
npm run trace path/to/trace.zip
```

### テストコードジェネレータ

```bash
# ローカルアプリケーションでコード生成
npm run codegen

# 特定のURLでコード生成
npm run codegen:url

# モバイルデバイスで生成
npm run codegen:mobile
```

## 📝 テストカバレッジ

### 00_サンプルテスト (`00_example.spec.js`)
- ✅ ログインテスト
- ✅ Todo作成テスト

### 01_認証機能のテスト (`01_auth.spec.js`)
- ✅ ログイン成功
- ✅ 新規ユーザー登録
- ✅ ログアウト

### 02_Todo CRUD操作のテスト (`02_todo-crud.spec.js`)
- ✅ Todoを作成
- ✅ Todoを編集
- ✅ Todoの完了状態を切り替え
- ✅ Todoを削除

### 03_Todoフィルタリング機能のテスト (`03_todo-filter.spec.js`)
- ✅ すべてのTodoを表示
- ✅ 未完了のTodoのみ表示
- ✅ 完了済のTodoのみ表示
- ✅ フィルター切り替え動作

## 🛠️ 自動エビデンス機能

各テストでは自動的にスクリーンショットが取得されます。

### 使用方法

```javascript
import { enableAutoEvidence, captureTestResult } from '../helpers/evidence.js';

test('テスト例', async ({ page }) => {
  const outputDir = './screenshots/テストグループ名/テストケース名';

  // 自動スクリーンショット有効化
  enableAutoEvidence(page, outputDir);

  // テスト処理...
  await page.locator('#username').fill('testuser'); // 自動でスクリーンショット
  await page.locator('button').click(); // 自動でスクリーンショット

  // 最終結果のキャプチャ
  await captureTestResult(page, outputDir);
});
```

### スクリーンショットが保存される操作
- `fill()` - 入力フィールドへの入力
- `click()` - ボタンやリンクのクリック
- `check()` - チェックボックスのチェック
- `uncheck()` - チェックボックスのチェック解除

### フォルダ構造

スクリーンショットは以下のような構造で保存されます：

```
screenshots/
├── 00_サンプルテスト/
│   ├── ログインテスト/
│   │   ├── step01_fill.png
│   │   ├── step02_click.png
│   │   └── result.png
│   └── Todo作成テスト/
├── 01_認証機能のテスト/
│   ├── ログイン成功/
│   ├── 新規ユーザー登録/
│   └── ログアウト/
├── 02_Todo_CRUD操作のテスト/
└── 03_Todoフィルタリング機能のテスト/
```

## 🔧 設定

### 環境変数

テストは `playwright.config.js` で設定されたベースURLを使用します：

```javascript
baseURL: process.env.BASE_URL || 'http://localhost'
```

環境変数で上書きできます：

```bash
BASE_URL=http://localhost:3000 npm test
```

### データベース接続

`helpers/database.js` を使用してテストデータをセットアップできます。

#### SQLファイルを実行

```javascript
import { executeSqlFile, executeSqlFolder } from '../helpers/database.js';

// 単一のSQLファイルを実行
await executeSqlFile('setup.sql');

// フォルダ内のすべてのSQLファイルを実行
await executeSqlFolder('login-test');
```

### グローバルセットアップ

`tests/global-setup.js` でテスト実行前の初期化処理を行います：
- データベースのクリーンアップ
- テストデータのセットアップ

## 📈 CI/CD統合

GitHub Actionsやその他のCIツールで実行する場合：

```bash
# CI環境での実行
CI=true npm test
```

CI環境では以下の設定が自動的に適用されます：
- リトライ回数: 2回
- 並列実行: 無効
- `test.only` の使用禁止

## 🐛 トラブルシューティング

### アプリケーションに接続できない

1. Dockerコンテナが起動していることを確認：
   ```bash
   docker-compose ps
   ```

2. ブラウザで http://localhost が開けることを確認

3. ベースURLが正しいことを確認

### データベース接続エラー

1. `.env`ファイルの設定を確認
2. MySQLコンテナが起動していることを確認：
   ```bash
   docker-compose ps mysql
   ```
3. データベース接続情報がdocker-compose.ymlと一致していることを確認

### テストがタイムアウトする

`playwright.config.js` でタイムアウトを増やします：

```javascript
use: {
  actionTimeout: 30000, // アクション毎のタイムアウト
  navigationTimeout: 30000, // ナビゲーションのタイムアウト
}
```

### ブラウザが見つからない

```bash
npm run install:browsers
```

### クリーンアップが失敗する

1. データベース接続情報を確認
2. rootユーザーのパスワードを確認
3. 詳細は `DATABASE_CLEANUP.md` を参照

## 📚 参考リンク

- [Playwright公式ドキュメント](https://playwright.dev/)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Best Practices](https://playwright.dev/docs/best-practices)

## 💡 ベストプラクティス

1. **テストの独立性**: 各テストは独立して実行できるようにする
2. **適切な待機**: `expect()` の自動待機を活用
3. **自動エビデンス**: `enableAutoEvidence()` で操作履歴を自動記録
4. **データクリーンアップ**: グローバルセットアップで自動クリーンアップ
5. **明確な命名**: テストケース名は日本語でわかりやすく

## 🎯 テスト作成のガイドライン

### 新しいテストケースを追加する場合

1. `tests/specs/` に適切な番号付きファイルを作成
2. `test.describe()` でグループ化
3. `enableAutoEvidence()` で自動スクリーンショット有効化
4. `captureTestResult()` で最終結果をキャプチャ
5. タイムスタンプを使用してデータの一意性を確保

### テストファイルの命名規則

```
00_example.spec.js      # サンプル・例
01_auth.spec.js         # 認証機能
02_todo-crud.spec.js    # CRUD操作
03_todo-filter.spec.js  # フィルタリング
```

## 🤝 貢献

新しいテストケースを追加する場合：

1. 適切なディレクトリにテストファイルを作成
2. ヘルパー関数を活用
3. テストケース名は明確に（日本語推奨）
4. 自動エビデンス機能を使用
5. 必要に応じてREADMEを更新

---

Happy Testing! 🎉
