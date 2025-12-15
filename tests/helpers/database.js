import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  multipleStatements: true
};

/**
 * 単一のSQLファイルを実行
 * @param {string} filename
 */
export async function executeSqlFile(filename) {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const sqlPath = path.join(process.cwd(), process.env.SQL_PATH, filename);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await connection.query(sql);
    console.log(`✓ ${filename} を実行しました`);
  } finally {
    await connection.end();
  }
}

/**
 * フォルダ内のSQLファイルを全て実行
 * @param {string} folderName - フォルダ名
 * @param {object} [options] - オプション
 * @param {boolean} [options.sort=true] - ファイル名でソートするか
 */
export async function executeSqlFolder(folderName, options = {}) {
  const { sort = true } = options;
  const connection = await mysql.createConnection(dbConfig);

  try {
    const folderPath = path.join(process.cwd(), process.env.SQL_PATH, folderName);

    // フォルダ内の.sqlファイルを取得
    let files = fs.readdirSync(folderPath)
      .filter(file => file.endsWith('.sql'));

    // ソート（01_users.sql, 02_todos.sql のような順序で実行）
    if (sort) {
      files = files.sort();
    }

    console.log(`📁 ${folderName} フォルダ内のSQLを実行します...`);

    for (const file of files) {
      const sqlPath = path.join(folderPath, file);
      const sql = fs.readFileSync(sqlPath, 'utf8');
      await connection.query(sql);
      console.log(`  ✓ ${file}`);
    }

    console.log(`✅ ${files.length}件のSQLファイルを実行しました`);
  } finally {
    await connection.end();
  }
}
