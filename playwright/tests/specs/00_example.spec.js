// @ts-check
import { test, expect } from '@playwright/test';
import { enableAutoEvidence, captureTestResult } from '../helpers/evidence.js';
import { executeSqlFolder } from '../helpers/database.js';

test.describe('00_サンプルテスト', () => {

  test('ログインテスト', async ({ page }) => {
    const outputDir = './screenshots/00_サンプルテスト/ログインテスト';
    enableAutoEvidence(page, outputDir);

    // テスト用データをDBに投入
    await executeSqlFolder('login-test');

    // ログイン画面へ移動
    await page.goto('/login');

    // testuserでログイン
    await page.locator('#username').fill('testuser2');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    // Todoページにリダイレクトされることを確認
    await expect(page).toHaveURL('/');
    await expect(page.locator('.header h1')).toHaveText('Todo アプリ');

    await captureTestResult(page, outputDir);
  });

  test('Todo作成テスト', async ({ page }) => {
    const outputDir = './screenshots/00_サンプルテスト/Todo作成テスト';
    enableAutoEvidence(page, outputDir);

    // テスト用データをDBに投入
    await executeSqlFolder('login-test');

    // ログイン
    await page.goto('/login');
    await page.locator('#username').fill('testuser2');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('/');

    // Todoを作成
    const todoTitle = `サンプルTodo ${Date.now()}`;
    await page.locator('.input-title').fill(todoTitle);
    await page.locator('.add-todo-section button[type="submit"]').click();

    // 作成されたTodoが表示されることを確認
    await expect(page.locator('.todo-item').filter({ hasText: todoTitle })).toBeVisible();

    await captureTestResult(page, outputDir);
  });
});
