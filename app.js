const express = require('express');
const app = express();

// ルート1：トップページ
app.get('/', (req, res) => {
  res.send('トップページです');
});

// ルート2：自己紹介ページ
app.get('/about', (req, res) => {
  res.send('自己紹介ページです');
});

// ルート3：現在時刻を返す
app.get('/time', (req, res) => {
  const now = new Date().toLocaleString('ja-JP');
  res.send('現在時刻：' + now);
});

app.listen(3000, () => {
  console.log('サーバーが起動しました: http://localhost:3000');
});
