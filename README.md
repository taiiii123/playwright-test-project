# Playwright テストプロジェクト

[![Playwright Tests](https://github.com/taiiii123/playwright-test-project/actions/workflows/playwright-docker.yml/badge.svg)](https://github.com/taiiii123/playwright-test-project/actions/workflows/playwright-docker.yml)

TodoアプリケーションのE2Eテスト自動化プロジェクトです。

## ✨ 特徴

- 🎭 **Playwright**: モダンなE2Eテストフレームワーク
- 📸 **自動エビデンス**: 各操作のスクリーンショットを自動保存
- 🗄️ **自動DB管理**: テスト実行前に自動クリーンアップとセットアップ
- 🔄 **CI/CD統合**: GitHub Actionsで自動テスト実行
- 🐳 **Docker対応**: 本番環境に近い構成でテスト可能

## 📊 テストカバレッジ

- ✅ 認証機能（ログイン、登録、ログアウト）: 3件
- ✅ Todo CRUD操作: 4件
- ✅ フィルタリング機能: 4件
- ✅ サンプルテスト: 2件
- **合計**: 13件のテストケース

## 🚀 クイックスタート

### 前提条件

- Docker & Docker Compose
- Node.js 20以上

### ローカル環境でテスト実行

```bash
# 1. アプリケーションを起動
docker-compose up -d

# 2. Playwrightのセットアップ
cd playwright
npm install
npm run install:browsers

# 3. テストを実行
npm test
```

### GitHub Actionsでテスト実行

1. リポジトリをGitHubにプッシュ
2. 自動的にテストが実行されます
3. 「Actions」タブで結果を確認

詳細は [GitHub Actionsガイド](.github/GITHUB_ACTIONS.md) を参照してください。

## 📚 ドキュメント

- [📁 Playwrightドキュメント](playwright/README.md) - テスト実装の詳細
- [🔄 GitHub Actions](\.github\GITHUB_ACTIONS.md) - CI/CD設定ガイド

## 🎯 テストの実行方法

```bash
cd playwright

# すべてのテストを実行
npm test

# UIモードで実行（推奨）
npm run test:ui

# ブラウザを表示して実行
npm run test:headed

# 特定のテストのみ実行
npm run test:auth  # 認証テスト
npm run test:todos # Todoテスト
```

## 📸 自動エビデンス

テスト実行時、以下のフォルダ構造でスクリーンショットが自動保存されます：

```
screenshots/
├── 00_サンプルテスト/
├── 01_認証機能のテスト/
├── 02_Todo_CRUD操作のテスト/
└── 03_Todoフィルタリング機能のテスト/
```

## 🗄️ データベース管理

テスト実行前に自動的に：
1. 🧹 古いテストデータをクリーンアップ
2. 👤 テストユーザー（testuser2）をセットアップ
3. 📝 サンプルTodoデータを投入

手動クリーンアップ：
```bash
npm run cleanup
```

## 🔄 CI/CD

### GitHub Actions

2つのワークフローを提供：

1. **playwright-docker.yml**（推奨）
   - Docker Composeを使用
   - 本番環境に近い構成
   - セットアップが簡単

2. **playwright.yml**
   - GitHub Actionsサービスを使用
   - より細かい制御が可能

### テスト結果の確認

- ✅ 成功時: すべてのステップにグリーンチェック
- ❌ 失敗時: エラーログとArtifacts（レポート、スクリーンショット）をダウンロード可能

## 🛠️ 技術スタック

- **テストフレームワーク**: Playwright
- **フロントエンド**: Vue 3 + TypeScript
- **バックエンド**: Spring Boot + Java
- **データベース**: MySQL 8.0
- **CI/CD**: GitHub Actions
- **コンテナ**: Docker & Docker Compose

## 📁 プロジェクト構造

```
playwright-test-project/
├── .github/
│   └── workflows/           # GitHub Actionsワークフロー
├── playwright/
│   ├── tests/
│   │   ├── specs/          # テストファイル
│   │   ├── helpers/        # ヘルパー関数
│   │   ├── data/sql/       # SQLファイル
│   │   └── global-setup.js # グローバルセットアップ
│   ├── screenshots/        # 自動エビデンス
│   └── playwright.config.js
├── todo-app-backend/       # Spring Bootアプリ
├── todo-app-frontend/      # Vue 3アプリ
├── docker-compose.yml
└── README.md
```

## 🧪 テスト作成ガイドライン

新しいテストを作成する場合：

1. `playwright/tests/specs/` に番号付きファイルを作成
2. `test.describe()` でグループ化
3. `enableAutoEvidence()` で自動スクリーンショット有効化
4. `captureTestResult()` で最終結果をキャプチャ

## 🐛 トラブルシューティング

### アプリケーションに接続できない

```bash
# コンテナの状態を確認
docker-compose ps

# 再起動
docker-compose restart
```

### テストデータが蓄積される

```bash
# 手動クリーンアップ
cd playwright
npm run cleanup
```
