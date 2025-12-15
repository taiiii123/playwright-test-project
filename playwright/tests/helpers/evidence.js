// @ts-check
import fs from 'fs';
import path from 'path';

/** @typedef {import('@playwright/test').Page} Page */
/** @typedef {import('@playwright/test').Locator} Locator */

/**
 * 自動エビデンス取得を有効化
 * @param {Page} page
 * @param {string} testOutputDir - テストケース毎の出力ディレクトリ
 */
export function enableAutoEvidence(page, testOutputDir) {
  fs.mkdirSync(testOutputDir, { recursive: true });
  let stepCount = 0;

  // page.fill() をラップ
  const originalPageFill = page.fill.bind(page);
  page.fill = async (selector, value, options) => {
    stepCount++;
    const locator = page.locator(selector);
    await highlightElement(locator);
    await page.screenshot({
      path: path.join(testOutputDir, `step${String(stepCount).padStart(2, '0')}_fill_${sanitizeFilename(selector)}.png`)
    });
    await unhighlightElement(locator);
    return originalPageFill(selector, value, options);
  };

  // page.click() をラップ
  const originalPageClick = page.click.bind(page);
  page.click = async (selector, options) => {
    stepCount++;
    const locator = page.locator(selector);
    await highlightElement(locator);
    await page.screenshot({
      path: path.join(testOutputDir, `step${String(stepCount).padStart(2, '0')}_click_${sanitizeFilename(selector)}.png`)
    });
    await unhighlightElement(locator);
    return originalPageClick(selector, options);
  };

  // page.locator() のfillとclickもラップ
  const originalLocator = page.locator.bind(page);
  page.locator = (selector, options) => {
    const locator = originalLocator(selector, options);

    // fill をラップ
    const originalFill = locator.fill.bind(locator);
    locator.fill = async (value, fillOptions) => {
      stepCount++;
      await highlightElement(locator);
      await page.screenshot({
        path: path.join(testOutputDir, `step${String(stepCount).padStart(2, '0')}_fill.png`)
      });
      await unhighlightElement(locator);
      return originalFill(value, fillOptions);
    };

    // click をラップ
    const originalClick = locator.click.bind(locator);
    locator.click = async (clickOptions) => {
      stepCount++;
      await highlightElement(locator);
      await page.screenshot({
        path: path.join(testOutputDir, `step${String(stepCount).padStart(2, '0')}_click.png`)
      });
      await unhighlightElement(locator);
      return originalClick(clickOptions);
    };

    // check をラップ
    const originalCheck = locator.check.bind(locator);
    locator.check = async (checkOptions) => {
      stepCount++;
      await highlightElement(locator);
      await page.screenshot({
        path: path.join(testOutputDir, `step${String(stepCount).padStart(2, '0')}_check.png`)
      });
      await unhighlightElement(locator);
      return originalCheck(checkOptions);
    };

    // uncheck をラップ
    const originalUncheck = locator.uncheck.bind(locator);
    locator.uncheck = async (uncheckOptions) => {
      stepCount++;
      await highlightElement(locator);
      await page.screenshot({
        path: path.join(testOutputDir, `step${String(stepCount).padStart(2, '0')}_uncheck.png`)
      });
      await unhighlightElement(locator);
      return originalUncheck(uncheckOptions);
    };

    return locator;
  };
}

/**
 * 要素をハイライト表示
 * @param {Locator} locator
 */
async function highlightElement(locator) {
  try {
    await locator.evaluate((el) => {
      el.style.outline = '3px solid red';
      el.style.outlineOffset = '2px';
    });
  } catch (error) {
    // 要素が見つからない場合はスキップ
    console.warn('Element not found for highlighting:', error.message);
  }
}

/**
 * 要素のハイライトを解除
 * @param {Locator} locator
 */
async function unhighlightElement(locator) {
  try {
    await locator.evaluate((el) => {
      el.style.outline = '';
      el.style.outlineOffset = '';
    });
  } catch (error) {
    // 要素が見つからない場合はスキップ
  }
}

/**
 * ファイル名として安全な文字列に変換
 * @param {string} str
 * @returns {string}
 */
function sanitizeFilename(str) {
  return str
    .replace(/[^a-z0-9]/gi, '_')
    .substring(0, 50);
}

/**
 * テスト終了時のスクリーンショットを撮影
 * @param {Page} page
 * @param {string} testOutputDir - テストケース毎の出力ディレクトリ
 * @param {string} [filename='final_result.png'] - ファイル名
 */
export async function captureTestResult(page, testOutputDir, filename = 'final_result.png') {
  await page.waitForTimeout(500); // 画面の安定を待つ
  await page.screenshot({
    path: path.join(testOutputDir, filename),
    fullPage: true // ページ全体をキャプチャ
  });
}
