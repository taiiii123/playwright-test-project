# テストディレクトリ構造

このディレクトリには、TodoアプリケーションのE2Eテストが整理されて格納されています。

## 📁 ディレクトリ構造

```
tests/
├── specs/                      # テストスペック（実際のテストファイル）
│   ├── auth/                   # 認証関連のテスト
│   │   ├── login.spec.js       # ログイン機能テスト
│   │   ├── register.spec.js    # ユーザー登録テスト
│   │   └── logout.spec.js      # ログアウト機能テスト
│   └── todos/                  # Todo機能のテスト
│       └── crud.spec.js        # Todo CRUD操作テスト
│
├── helpers/                    # ヘルパー関数（テストで再利用）
│   ├── auth-helper.js          # 認証操作のヘルパー
│   ├── todo-helper.js          # Todo操作のヘルパー
│   ├── evidence.js             # 自動スクリーンショット機能
│   └── database.js             # データベース操作ヘルパー
│
├── data/                       # テストデータ
│   └── sql/                    # SQLテストデータ
│       └── login-test/         # ログインテスト用データ
│
├── fixtures/                   # テストフィクスチャ（共通セットアップ）
│   └── (今後追加予定)
│
└── _archive/                   # アーカイブ（旧テストファイル）
    └── example.spec.js         # サンプルテストファイル
```

## 📝 各ディレクトリの説明

### specs/ - テストスペック
実際のテストケースが格納されています。機能別にディレクトリ分けされています。

**auth/** - 認証関連テスト
- `login.spec.js`: ログイン機能のテスト（正常系・異常系）
- `register.spec.js`: ユーザー登録のテスト（バリデーション含む）
- `logout.spec.js`: ログアウト機能とセッション管理のテスト

**todos/** - Todo機能テスト
- `crud.spec.js`: Todo CRUD操作の統合テスト
  - 作成（Create）
  - 読み取り（Read）
  - 更新（Update）
  - 削除（Delete）
  - フィルタリング

### helpers/ - ヘルパー関数
テストコードで再利用する共通機能を提供します。

- **auth-helper.js**: 認証操作を簡略化
  ```javascript
  import { login, logout, register } from '../helpers/auth-helper.js';
  ```

- **todo-helper.js**: Todo操作を簡略化
  ```javascript
  import { createTodo, deleteTodo, editTodo } from '../helpers/todo-helper.js';
  ```

- **evidence.js**: 自動スクリーンショット機能
  ```javascript
  import { enableAutoEvidence } from '../helpers/evidence.js';
  enableAutoEvidence(page, './screenshots/test-name');
  ```

- **database.js**: テストデータのセットアップ

### data/ - テストデータ
テストで使用する静的データを格納します。

- **sql/**: SQLスクリプトやテストデータ
  - データベース初期化スクリプト
  - テスト用データセット

### fixtures/ - テストフィクスチャ
共通のセットアップやティアダウンロジックを格納します（今後拡張予定）。

### _archive/ - アーカイブ
使用しなくなった古いテストファイルを保管します。

## 🎯 テストの実行方法

### すべてのテストを実行
```bash
npm test
```

### 特定のカテゴリのみ実行
```bash
# 認証テストのみ
npm run test:auth

# Todoテストのみ
npm run test:todos
```

### UIモードで実行（推奨）
```bash
npm run test:ui
```

## 📸 スクリーンショット保存先

テスト実行時のスクリーンショットは、テストファイルと同じ階層ではなく、プロジェクトルートの`screenshots/`ディレクトリに保存されます：

```
playwright/
├── screenshots/              # 自動生成されるスクリーンショット
│   ├── login-test/
│   │   ├── 正常なログイン/
│   │   │   ├── step01_fill.png
│   │   │   ├── step02_fill.png
│   │   │   └── step03_click.png
│   │   └── ...
│   ├── register-test/
│   └── todo-test/
└── tests/
    └── specs/
```

## 🔧 新しいテストの追加

### 1. 適切なディレクトリにテストファイルを作成
```bash
# 新しい機能のテストディレクトリを作成
mkdir -p tests/specs/new-feature

# テストファイルを作成
touch tests/specs/new-feature/feature.spec.js
```

### 2. テストファイルの基本構造
```javascript
import { test, expect } from '@playwright/test';
import { enableAutoEvidence } from '../../helpers/evidence.js';
import { login } from '../../helpers/auth-helper.js';

test.describe('新機能のテスト', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('テストケース名', async ({ page }) => {
    const outputDir = './screenshots/feature-test/テストケース名';
    enableAutoEvidence(page, outputDir);

    // テストロジック
    await page.click('button');
    await expect(page.locator('text=成功')).toBeVisible();
  });
});
```

### 3. package.jsonにスクリプトを追加（オプション）
```json
{
  "scripts": {
    "test:new-feature": "playwright test new-feature"
  }
}
```

## 📚 ベストプラクティス

1. **テストの独立性**: 各テストは他のテストに依存せず、単独で実行可能にする
2. **ヘルパーの活用**: 共通操作はhelpersディレクトリのヘルパー関数を使う
3. **明確な命名**: テストケース名は何をテストしているか明確に
4. **エビデンス取得**: 重要なテストケースには`enableAutoEvidence()`を使う
5. **適切な配置**: 機能別にspecsディレクトリ内を整理

## 🔗 関連ドキュメント

- [Playwright README](../README.md) - 詳細なテスト実行ガイド
- [Testing Guide](../../README.md) - 全体的なテストガイド
