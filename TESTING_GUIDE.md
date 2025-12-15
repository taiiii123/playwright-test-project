# Playwright テストガイド

このプロジェクトの自動テスト環境の完全ガイドです。

## 📋 目次

1. [概要](#概要)
2. [セットアップ](#セットアップ)
3. [テストの実行](#テストの実行)
4. [作成されたテスト](#作成されたテスト)
5. [自動エビデンス機能](#自動エビデンス機能)
6. [データベース管理](#データベース管理)
7. [テスト結果の確認](#テスト結果の確認)
8. [トラブルシューティング](#トラブルシューティング)

## 概要

TodoアプリケーションのE2Eテストスイートが完成しました。以下の特徴があります：

- **自動エビデンス取得**: 各操作のスクリーンショットを自動保存
- **自動データベース管理**: テスト実行前に自動クリーンアップとセットアップ
- **包括的なテストカバレッジ**: 認証、CRUD操作、フィルタリングなど
- **合計テストケース数**: 13件（サンプル含む）

## セットアップ

### ステップ1: Dockerアプリケーションの起動

まず、アプリケーションをDockerで起動します：

```bash
# プロジェクトルートディレクトリで
docker-compose up -d
```

以下のサービスが起動します：
- **フロントエンド**: http://localhost (ポート80)
- **バックエンド**: http://localhost:8080
- **MySQL**: localhost:3309

### ステップ2: Playwrightのセットアップ

```bash
# playwrightディレクトリに移動
cd playwright

# 依存関係をインストール
npm install

# Playwrightブラウザをインストール
npm run install:browsers
```

### ステップ3: 環境変数の確認

`.env`ファイルが正しく設定されていることを確認：

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

## テストの実行

### 推奨: UIモードでテストを実行

```bash
npm run test:ui
```

UIモードでは以下ができます：
- テストケースを選択して実行
- リアルタイムでブラウザの動作を確認
- テスト結果を視覚的に確認
- デバッグが容易

### ヘッドレスモードで全テストを実行

```bash
npm test
```

実行時の出力例：
```
🔧 テスト実行前のセットアップを開始します...
🧹 データベースをクリーンアップしています...
✅ クリーンアップが完了しました
👤 テストユーザーをセットアップしています...
✅ テストユーザーのセットアップが完了しました

Running 13 tests using 12 workers
  13 passed (6.2s)
```

### 特定のテストスイートのみ実行

```bash
# 認証テストのみ
npm run test:auth

# Todoテストのみ
npm run test:todos
```

### ブラウザを表示して実行

```bash
npm run test:headed
```

### デバッグモード

```bash
npm run test:debug
```

## 作成されたテスト

### 📁 tests/specs/ - テストファイル

#### 00_example.spec.js - サンプルテスト
- ✅ ログインテスト（login-testデータを使用）
- ✅ Todo作成テスト（login-testデータを使用）

**特徴**: `executeSqlFolder('login-test')`を使用してtestuser2をセットアップする方法を示すサンプル

#### 01_auth.spec.js - 認証機能のテスト
- ✅ ログイン成功（testuser2でログイン）
- ✅ 新規ユーザー登録（タイムスタンプ付き一意なユーザー名で登録）
- ✅ ログアウト（testuser2でログイン後にログアウト）

#### 02_todo-crud.spec.js - Todo CRUD操作のテスト
- ✅ Todoを作成（タイムスタンプ付き一意なタイトル）
- ✅ Todoを編集（タイトルと説明を変更）
- ✅ Todoの完了状態を切り替え（未完了→完了→未完了）
- ✅ Todoを削除（削除確認モーダルからの削除）

#### 03_todo-filter.spec.js - Todoフィルタリング機能のテスト
- ✅ すべてのTodoを表示（フィルター「すべて」）
- ✅ 未完了のTodoのみ表示（フィルター「未完了」）
- ✅ 完了済のTodoのみ表示（フィルター「完了」）
- ✅ フィルター切り替え動作（すべて→未完了→完了→すべて）

## 自動エビデンス機能

### 概要

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
│   │   ├── step02_fill.png
│   │   ├── step03_click.png
│   │   └── result.png
│   └── Todo作成テスト/
├── 01_認証機能のテスト/
│   ├── ログイン成功/
│   ├── 新規ユーザー登録/
│   └── ログアウト/
├── 02_Todo_CRUD操作のテスト/
│   ├── Todoを作成/
│   ├── Todoを編集/
│   ├── Todoの完了状態を切り替え/
│   └── Todoを削除/
└── 03_Todoフィルタリング機能のテスト/
    ├── すべてのTodoを表示/
    ├── 未完了のTodoのみ表示/
    ├── 完了済のTodoのみ表示/
    └── フィルター切り替え動作/
```

## データベース管理

### 自動クリーンアップとセットアップ

テスト実行時、以下が自動的に実行されます：

1. **クリーンアップ** (`tests/data/sql/cleanup/`)
   - 新規登録ユーザー（`newuser*`）を削除
   - testuser/testuser2のTodoを削除
   - ユーザー自体は削除しない

2. **セットアップ** (`tests/data/sql/login-test/`)
   - testuser2ユーザーを作成
   - サンプルTodoデータを投入

### 手動クリーンアップ

必要に応じて手動でクリーンアップできます：

```bash
npm run cleanup
```

### テストユーザー

以下のテストユーザーが使用可能です：

- **testuser2** (login-testで作成)
  - ユーザー名: `testuser2`
  - パスワード: `password123`
  - メール: `test@abc.com`

### データベース接続

`helpers/database.js`を使用してSQLファイルを実行できます：

```javascript
import { executeSqlFile, executeSqlFolder } from '../helpers/database.js';

// 単一のSQLファイルを実行
await executeSqlFile('setup.sql');

// フォルダ内のすべてのSQLファイルを実行
await executeSqlFolder('login-test');
```

## テスト結果の確認

### HTMLレポートを表示

テスト実行後、HTMLレポートを確認できます：

```bash
npm run report
```

レポートには以下が含まれます：
- テストの成功/失敗数
- 実行時間
- 失敗したテストのスクリーンショット
- 失敗したテストのトレース

### スクリーンショットとビデオ

- **自動エビデンス**: `screenshots/` ディレクトリ
- **失敗時のスクリーンショット**: `test-results/` ディレクトリ
- **ビデオ**: `test-results/` ディレクトリ（失敗時のみ）
- **トレース**: デバッグ用のトレースファイル

## テストコード例

### 例1: 基本的なテスト（自動エビデンス付き）

```javascript
import { test, expect } from '@playwright/test';
import { enableAutoEvidence, captureTestResult } from '../helpers/evidence.js';

test('ログインテスト', async ({ page }) => {
  const outputDir = './screenshots/認証テスト/ログイン';
  enableAutoEvidence(page, outputDir);

  await page.goto('/login');
  await page.locator('#username').fill('testuser2');
  await page.locator('#password').fill('password123');
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL('/');

  await captureTestResult(page, outputDir);
});
```

### 例2: データベースセットアップを使用

```javascript
import { test, expect } from '@playwright/test';
import { executeSqlFolder } from '../helpers/database.js';
import { enableAutoEvidence, captureTestResult } from '../helpers/evidence.js';

test('カスタムデータでテスト', async ({ page }) => {
  const outputDir = './screenshots/カスタムテスト/テストケース';
  enableAutoEvidence(page, outputDir);

  // テスト用データをDBに投入
  await executeSqlFolder('login-test');

  // テスト処理...
  await page.goto('/login');
  await page.locator('#username').fill('testuser2');
  await page.locator('#password').fill('password123');
  await page.locator('button[type="submit"]').click();

  await captureTestResult(page, outputDir);
});
```

### 例3: beforeEachでのデータセットアップ

```javascript
test.describe('Todoテスト', () => {
  test.beforeEach(async ({ page }) => {
    // 各テストの前にログイン
    await page.goto('/login');
    await page.locator('#username').fill('testuser2');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL('/');
  });

  test('Todoを作成', async ({ page }) => {
    const outputDir = './screenshots/Todo/作成';
    enableAutoEvidence(page, outputDir);

    const todoTitle = `新しいTodo ${Date.now()}`;
    await page.locator('.input-title').fill(todoTitle);
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.todo-item').filter({ hasText: todoTitle })).toBeVisible();

    await captureTestResult(page, outputDir);
  });
});
```

## トラブルシューティング

### 問題1: アプリケーションに接続できない

**解決方法:**
```bash
# Dockerコンテナの状態を確認
docker-compose ps

# すべてのサービスが起動していることを確認
# 必要に応じて再起動
docker-compose restart
```

### 問題2: データベース接続エラー

**症状**: `Access denied for user 'root'@'172.19.0.1'`

**解決方法:**
1. `.env`ファイルの設定を確認
2. MySQLコンテナが起動していることを確認：
   ```bash
   docker-compose ps mysql
   ```
3. データベース接続情報がdocker-compose.ymlと一致していることを確認

### 問題3: テストがタイムアウトする

**解決方法:**
`playwright.config.js` でタイムアウトを調整：

```javascript
use: {
  actionTimeout: 30000,
  navigationTimeout: 30000,
}
```

### 問題4: ブラウザが見つからない

**解決方法:**
```bash
npm run install:browsers
```

### 問題5: テストデータが蓄積される

**症状**: フィルターテストで予想外の件数が表示される

**解決方法:**
```bash
# 手動でクリーンアップを実行
npm run cleanup

# または、テストを再実行（自動クリーンアップされる）
npm test
```

## ベストプラクティス

1. **テストの独立性**: 各テストは他のテストに依存せず、単独で実行可能にする
2. **自動エビデンス**: `enableAutoEvidence()` で操作履歴を自動記録
3. **明確なテスト名**: テストケース名は何をテストしているか明確に（日本語推奨）
4. **適切な待機**: `expect()` の自動待機を活用
5. **データの一意性**: タイムスタンプを使用してテストデータの一意性を確保
6. **クリーンアップ**: グローバルセットアップで自動クリーンアップされる

## テスト作成ガイドライン

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

## 次のステップ

1. **CI/CD統合**: GitHub ActionsやJenkinsでテストを自動実行
2. **カバレッジ拡張**: エッジケースや追加機能のテスト
3. **パフォーマンステスト**: ページロード時間などの測定
4. **アクセシビリティテスト**: a11yテストの追加

## 参考資料

- [Playwright公式ドキュメント](https://playwright.dev/)
- [テスト詳細ドキュメント](./playwright/README.md)
