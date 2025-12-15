// @ts-check
import { test, expect } from '@playwright/test';
import { enableAutoEvidence, captureTestResult } from '../helpers/evidence.js';

test.describe('01_認証機能のテスト', () => {

  test('ログイン成功', async ({ page }) => {
    const outputDir = './screenshots/01_認証機能のテスト/ログイン成功';
    enableAutoEvidence(page, outputDir);

    await page.goto('/login');

    // テストユーザーでログイン
    await page.locator('#username').fill('testuser2');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    // Todoリストページにリダイレクトされることを確認
    await expect(page).toHaveURL('/');
    await expect(page.locator('.header h1')).toHaveText('Todo アプリ');
    await expect(page.locator('.user-info')).toContainText('ようこそ、testuser2さん');

    await captureTestResult(page, outputDir);
  });

  test('新規ユーザー登録', async ({ page }) => {
    const outputDir = './screenshots/01_認証機能のテスト/新規ユーザー登録';
    enableAutoEvidence(page, outputDir);

    await page.goto('/login');

    // 新規登録リンクをクリック
    await page.locator('a').filter({ hasText: 'こちら' }).click();

    // 新規登録ページに遷移
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h1')).toHaveText('新規登録');

    // ユーザー情報を入力
    const timestamp = Date.now();
    await page.locator('#username').fill(`newuser${timestamp}`);
    await page.locator('#email').fill(`newuser${timestamp}@test.com`);
    await page.locator('#password').fill('newpassword123');
    await page.locator('#confirmPassword').fill('newpassword123');
    await page.locator('button[type="submit"]').click();

    // Todoリストページに直接遷移
    await expect(page).toHaveURL('/');
    await expect(page.locator('.user-info')).toContainText(`ようこそ、newuser${timestamp}さん`);

    await captureTestResult(page, outputDir);
  });

  test('ログアウト', async ({ page }) => {
    const outputDir = './screenshots/01_認証機能のテスト/ログアウト';
    enableAutoEvidence(page, outputDir);

    // まずログイン
    await page.goto('/login');
    await page.locator('#username').fill('testuser2');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    // Todoページに遷移したことを確認
    await expect(page).toHaveURL('/');

    // ログアウトボタンをクリック
    await page.locator('.btn-logout').click();

    // ログインページにリダイレクトされることを確認
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toHaveText('ログイン');

    await captureTestResult(page, outputDir);
  });
});
