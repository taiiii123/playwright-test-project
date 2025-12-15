// @ts-check
import { test, expect } from '@playwright/test';
import { enableAutoEvidence, captureTestResult } from '../helpers/evidence.js';

test.describe('03_Todoフィルタリング機能のテスト', () => {

  // 各テストの前にログインしてテストデータを作成
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.locator('#username').fill('testuser2');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL('/');

    // テスト用のTodoを複数作成
    const todos = [
      { title: `未完了Todo 1 ${Date.now()}`, completed: false },
      { title: `未完了Todo 2 ${Date.now() + 1}`, completed: false },
      { title: `完了済Todo 1 ${Date.now() + 2}`, completed: true },
    ];

    for (const todo of todos) {
      await page.locator('.input-title').fill(todo.title);
      await page.locator('.add-todo-section button[type="submit"]').click();
      await expect(page.locator('.todo-item').filter({ hasText: todo.title })).toBeVisible();

      // 完了状態にする必要がある場合
      if (todo.completed) {
        await page.locator('.todo-item').filter({ hasText: todo.title }).locator('input[type="checkbox"]').check();
        await page.waitForTimeout(300);
      }
    }
  });

  test('すべてのTodoを表示', async ({ page }) => {
    const outputDir = './screenshots/03_Todoフィルタリング機能のテスト/すべてのTodoを表示';
    enableAutoEvidence(page, outputDir);

    // 「すべて」フィルターをクリック
    await page.getByRole('button', { name: 'すべて', exact: true }).click();

    // ボタンがアクティブになることを確認
    await expect(page.getByRole('button', { name: 'すべて', exact: true })).toHaveClass(/active/);

    // 未完了と完了済の両方のTodoが表示されることを確認
    const todoItems = page.locator('.todo-item');
    const count = await todoItems.count();
    expect(count).toBeGreaterThanOrEqual(3);

    await captureTestResult(page, outputDir);
  });

  test('未完了のTodoのみ表示', async ({ page }) => {
    const outputDir = './screenshots/03_Todoフィルタリング機能のテスト/未完了のTodoのみ表示';
    enableAutoEvidence(page, outputDir);

    // 「未完了」フィルターをクリック
    await page.getByRole('button', { name: '未完了', exact: true }).click();

    // ボタンがアクティブになることを確認
    await expect(page.getByRole('button', { name: '未完了', exact: true })).toHaveClass(/active/);

    // 表示されているTodoを確認
    const visibleTodos = page.locator('.todo-item');
    const count = await visibleTodos.count();
    expect(count).toBeGreaterThanOrEqual(2); // 最低でも作成した2つの未完了Todoは表示されている

    // 全てのチェックボックスが未チェックであることを確認（未完了のみのフィルタが機能していることを確認）
    for (let i = 0; i < Math.min(count, 5); i++) { // 最初の5件だけチェック
      await expect(visibleTodos.nth(i).locator('input[type="checkbox"]')).not.toBeChecked();
    }

    await captureTestResult(page, outputDir);
  });

  test('完了済のTodoのみ表示', async ({ page }) => {
    const outputDir = './screenshots/03_Todoフィルタリング機能のテスト/完了済のTodoのみ表示';
    enableAutoEvidence(page, outputDir);

    // 「完了」フィルターをクリック
    await page.getByRole('button', { name: '完了', exact: true }).click();

    // ボタンがアクティブになることを確認
    await expect(page.getByRole('button', { name: '完了', exact: true })).toHaveClass(/active/);

    // 表示されているTodoを確認
    const visibleTodos = page.locator('.todo-item');
    const count = await visibleTodos.count();
    expect(count).toBeGreaterThanOrEqual(1); // 最低でも作成した1つの完了済Todoは表示されている

    // 全てのチェックボックスがチェック済みであることを確認（完了済のみのフィルタが機能していることを確認）
    for (let i = 0; i < Math.min(count, 5); i++) { // 最初の5件だけチェック
      await expect(visibleTodos.nth(i).locator('input[type="checkbox"]')).toBeChecked();
    }

    await captureTestResult(page, outputDir);
  });

  test('フィルター切り替え動作', async ({ page }) => {
    const outputDir = './screenshots/03_Todoフィルタリング機能のテスト/フィルター切り替え動作';
    enableAutoEvidence(page, outputDir);

    // 初期状態: すべて
    await page.getByRole('button', { name: 'すべて', exact: true }).click();
    const allCount = await page.locator('.todo-item').count();
    expect(allCount).toBeGreaterThanOrEqual(3);

    // 未完了に切り替え
    await page.getByRole('button', { name: '未完了', exact: true }).click();
    const activeCount = await page.locator('.todo-item').count();
    expect(activeCount).toBeGreaterThanOrEqual(2); // 最低でも2つの未完了Todo
    expect(activeCount).toBeLessThan(allCount); // すべてより少ない
    // 最初の5件のチェックボックスが未チェックであることを確認
    for (let i = 0; i < Math.min(activeCount, 5); i++) {
      await expect(page.locator('.todo-item').nth(i).locator('input[type="checkbox"]')).not.toBeChecked();
    }

    // 完了に切り替え
    await page.getByRole('button', { name: '完了', exact: true }).click();
    const completedCount = await page.locator('.todo-item').count();
    expect(completedCount).toBeGreaterThanOrEqual(1); // 最低でも1つの完了済Todo
    expect(completedCount).toBeLessThan(allCount); // すべてより少ない
    // 最初の5件のチェックボックスがチェック済みであることを確認
    for (let i = 0; i < Math.min(completedCount, 5); i++) {
      await expect(page.locator('.todo-item').nth(i).locator('input[type="checkbox"]')).toBeChecked();
    }

    // すべてに戻す
    await page.getByRole('button', { name: 'すべて', exact: true }).click();
    const finalCount = await page.locator('.todo-item').count();
    expect(finalCount).toBe(allCount); // 元の数に戻る

    await captureTestResult(page, outputDir);
  });
});
