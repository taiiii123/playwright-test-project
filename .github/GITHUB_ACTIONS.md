# GitHub Actions CI/CD ガイド

このプロジェクトではGitHub Actionsを使用してPlaywrightテストを自動実行します。

## 📋 ワークフロー

### 1. playwright-docker.yml（推奨）

Docker Composeを使用してテストを実行します。最もシンプルで信頼性が高い方法です。

**特徴:**
- ✅ Docker Composeで全サービスを起動
- ✅ 本番環境に近い構成
- ✅ セットアップが簡単
- ✅ ローカルと同じ環境

**トリガー:**
- `main`, `master`, `develop`ブランチへのプッシュ
- `main`, `master`, `develop`ブランチへのプルリクエスト
- 手動実行（workflow_dispatch）

### ステップ1: リポジトリにプッシュ

```bash
git add .
git commit -m "Add GitHub Actions workflow"
git push origin main
```

### ステップ2: GitHub Actionsの確認

1. GitHubリポジトリの「Actions」タブを開く
2. ワークフローが自動実行されることを確認
3. テスト結果を確認

### ステップ3: 手動実行（オプション）

1. GitHubリポジトリの「Actions」タブを開く
2. 左側から実行したいワークフローを選択
3. 「Run workflow」ボタンをクリック
4. ブランチを選択して「Run workflow」をクリック

## 📊 テスト結果の確認

### 成功時

- ✅ すべてのステップにグリーンのチェックマークが表示される
- テスト結果サマリーが表示される
- スクリーンショットがArtifactsにアップロードされる

### 失敗時

- ❌ 失敗したステップに赤い×マークが表示される
- エラーログを確認できる
- 以下のArtifactsがアップロードされる：
  - `playwright-report`: HTMLレポート
  - `screenshots`: 自動エビデンス
  - `test-results`: 失敗時のスクリーンショット・ビデオ

## 📦 Artifacts（成果物）

テスト実行後、以下のArtifactsがアップロードされます：

### 常にアップロード
- **playwright-report**: HTMLレポート（30日間保存）
- **screenshots**: 自動エビデンス（30日間保存）

### 失敗時のみアップロード
- **test-results**: 失敗時のスクリーンショット、ビデオ、トレース（30日間保存）

### Artifactsのダウンロード方法

1. GitHubリポジトリの「Actions」タブを開く
2. 該当するワークフロー実行をクリック
3. 下部の「Artifacts」セクションからダウンロード

## 🔧 カスタマイズ

### タイムアウトの変更

```yaml
jobs:
  test:
    timeout-minutes: 60  # デフォルトは60分
```

### テスト対象ブランチの変更

```yaml
on:
  push:
    branches: [ main, master, develop, feature/* ]
```

### テスト実行時の環境変数

```yaml
- name: Run Playwright tests
  working-directory: ./playwright
  run: npm test
  env:
    CI: true
    BASE_URL: http://localhost
```

### リトライ回数の設定

`playwright.config.js`で設定されています：

```javascript
retries: process.env.CI ? 2 : 0,
```

CI環境では自動的に2回リトライされます。

## 🐛 トラブルシューティング

### 問題1: テストがタイムアウトする

**原因**: コンテナの起動に時間がかかっている

**解決方法**:
```yaml
- name: Start Docker containers
  run: |
    docker-compose up -d
    sleep 60  # 待機時間を増やす
```

### 問題2: データベース接続エラー

**原因**: MySQLの準備が完了していない

**解決方法**:
ヘルスチェックの待機時間を増やす：

```yaml
timeout 120 bash -c 'until docker-compose exec -T mysql mysqladmin ping -h localhost -u root -prootpassword --silent; do sleep 2; done'
```

### 問題3: テストが全て失敗する

**原因**: アプリケーションが起動していない

**解決方法**:
1. ワークフローのログを確認
2. コンテナログを確認（失敗時に自動出力）
3. 起動待機時間を調整

### 問題4: Artifactsがアップロードされない

**原因**: パスが間違っている

**解決方法**:
```yaml
- name: Upload screenshots
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: screenshots
    path: playwright/screenshots/  # 正しいパスを指定
```

## 📈 ベストプラクティス

1. **ワークフロー名を明確に**: 複数のワークフローがある場合、わかりやすい名前をつける
2. **適切なトリガー設定**: 不要なビルドを避ける
3. **キャッシュの活用**: `node_modules`をキャッシュしてビルド時間を短縮
4. **失敗時のログ出力**: デバッグに必要な情報を出力
5. **Artifactsの保存期間**: ストレージコストを考慮して適切な期間を設定

## 🔐 シークレットの設定（必要に応じて）

本番環境のテストなど、機密情報が必要な場合：

1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」
2. 「New repository secret」をクリック
3. 以下のようなシークレットを追加：
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - など

ワークフローでの使用方法：

```yaml
- name: Run Playwright tests
  env:
    DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
  run: npm test
```

## 📊 バッジの追加

README.mdにテスト結果のバッジを追加：

```markdown
![Playwright Tests](https://github.com/ユーザー名/リポジトリ名/actions/workflows/playwright-docker.yml/badge.svg)
```

## 参考リンク

- [GitHub Actions公式ドキュメント](https://docs.github.com/ja/actions)
- [Playwright CI設定ガイド](https://playwright.dev/docs/ci)
- [Docker Composeドキュメント](https://docs.docker.com/compose/)
