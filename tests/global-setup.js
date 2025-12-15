import { executeSqlFolder } from './helpers/database.js';

export default async function globalSetup() {
  console.log('\n🔧 テスト実行前のセットアップを開始します...');

  try {
    // クリーンアップ
    console.log('🧹 データベースをクリーンアップしています...');
    await executeSqlFolder('cleanup');
    console.log('✅ クリーンアップが完了しました');

    // テストユーザーのセットアップ
    console.log('👤 テストユーザーをセットアップしています...');
    await executeSqlFolder('login-test');
    console.log('✅ テストユーザーのセットアップが完了しました\n');
  } catch (error) {
    console.log('⚠️  セットアップ中にエラーが発生しました:', error.message);
    console.log('   テストは継続されますが、正常に動作しない可能性があります\n');
  }
}
