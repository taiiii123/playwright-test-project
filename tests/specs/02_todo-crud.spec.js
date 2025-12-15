// @ts-check
import { test, expect } from '@playwright/test';
import { enableAutoEvidence, captureTestResult } from '../helpers/evidence.js';

test.describe('02_Todo CRUD操作のテスト', () => {

  // 各テストの前にログイン
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.locator('#username').fill('testuser2');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL('/');
  });

  test('Todoを作成', async ({ page }) => {
    const outputDir = './screenshots/02_Todo_CRUD操作のテスト/Todoを作成';
    enableAutoEvidence(page, outputDir);

    const todoTitle = `テストTodo ${Date.now()}`;
    const todoDescription = 'これはテストの説明です';

    // Todoを作成
    await page.locator('.input-title').fill(todoTitle);
    await page.locator('.input-description').fill(todoDescription);
    await page.locator('.add-todo-section button[type="submit"]').click();

    // Todoが一覧に表示されることを確認
    await expect(page.locator('.todo-item').filter({ hasText: todoTitle })).toBeVisible();
    await expect(page.locator('.todo-item').filter({ hasText: todoTitle })).toContainText(todoDescription);

    await captureTestResult(page, outputDir);
  });

  test('Todoを編集', async ({ page }) => {
    const outputDir = './screenshots/02_Todo_CRUD操作のテスト/Todoを編集';
    enableAutoEvidence(page, outputDir);

    // 元のTodoを作成
    const originalTitle = `元のタイトル ${Date.now()}`;
    const originalDescription = '元の説明';

    await page.locator('.input-title').fill(originalTitle);
    await page.locator('.input-description').fill(originalDescription);
    await page.locator('.add-todo-section button[type="submit"]').click();
    await expect(page.locator('.todo-item').filter({ hasText: originalTitle })).toBeVisible();

    // 編集ボタンをクリック
    await page.locator('.todo-item').filter({ hasText: originalTitle }).locator('.btn-edit').click();

    // 値を変更して更新
    const newTitle = `更新後のタイトル ${Date.now()}`;
    const newDescription = '更新後の説明';

    await page.locator('.input-title').fill(newTitle);
    await page.locator('.input-description').fill(newDescription);
    await page.locator('.add-todo-section button[type="submit"]').click();

    // 更新されたTodoが表示されることを確認
    await expect(page.locator('.todo-item').filter({ hasText: newTitle })).toBeVisible();
    await expect(page.locator('.todo-item').filter({ hasText: newTitle })).toContainText(newDescription);

    await captureTestResult(page, outputDir);
  });

  test('Todoの完了状態を切り替え', async ({ page }) => {
    const outputDir = './screenshots/02_Todo_CRUD操作のテスト/Todoの完了状態を切り替え';
    enableAutoEvidence(page, outputDir);

    const todoTitle = `完了切替テスト ${Date.now()}`;

    await page.locator('.input-title').fill(todoTitle);
    await page.locator('.add-todo-section button[type="submit"]').click();

    const todoItem = page.locator('.todo-item').filter({ hasText: todoTitle });
    await expect(todoItem).toBeVisible();

    // 未完了状態であることを確認
    await expect(todoItem).not.toHaveClass(/completed/);

    // チェックボックスをクリックして完了にする
    await todoItem.locator('input[type="checkbox"]').check();

    // 完了状態になることを確認
    await expect(todoItem).toHaveClass(/completed/);
    await expect(todoItem.locator('input[type="checkbox"]')).toBeChecked();

    await captureTestResult(page, outputDir);
  });

  test('Todoを削除', async ({ page }) => {
    const outputDir = './screenshots/02_Todo_CRUD操作のテスト/Todoを削除';
    enableAutoEvidence(page, outputDir);

    const todoTitle = `削除テスト ${Date.now()}`;

    // Todoを作成
    await page.locator('.input-title').fill(todoTitle);
    await page.locator('.add-todo-section button[type="submit"]').click();
    await expect(page.locator('.todo-item').filter({ hasText: todoTitle })).toBeVisible();

    // 削除ボタンをクリック
    await page.locator('.todo-item').filter({ hasText: todoTitle }).locator('.btn-delete').click();

    // 削除確認モーダルが表示されることを確認
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('.modal-content h3')).toHaveText('削除の確認');

    // 削除を確定
    await page.locator('.btn-danger').click();

    // Todoが削除されることを確認
    await expect(page.locator('.todo-item').filter({ hasText: todoTitle })).not.toBeVisible();

    await captureTestResult(page, outputDir);
  });
});
