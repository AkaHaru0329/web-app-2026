require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 3021;

// JSON形式で送信されたデータを req.body で使えるようにする
app.use(express.json());

// Reactの本番ビルドを先に公開
app.use(express.static('frontend/dist'));

// 既存のpublicフォルダを公開
app.use(express.static('public'));

// PostgreSQLへの接続設定
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// メッセージ一覧を取得
app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM messages ORDER BY created_at ASC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('メッセージ取得エラー:', error);

    res.status(500).json({
      error: 'メッセージの取得に失敗しました',
    });
  }
});

// 新しいメッセージを保存
app.post('/api/messages', async (req, res) => {
  try {
    const { username, text } = req.body;

    // 入力チェック
    if (!username || !text) {
      return res.status(400).json({
        error: 'ユーザー名とメッセージを入力してください',
      });
    }

    const result = await pool.query(
      `INSERT INTO messages (username, text)
       VALUES ($1, $2)
       RETURNING *`,
      [username, text]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('メッセージ保存エラー:', error);

    res.status(500).json({
      error: 'メッセージの保存に失敗しました',
    });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});