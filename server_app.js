require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// 一覧取得
app.get("/api/servers", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM servers ORDER BY id ASC"
  );

  res.json(result.rows);
});

// 登録
app.post("/api/servers", async (req, res) => {

  const {
    name,
    status,
    cpu_usage,
    memory_usage
  } = req.body;

  const result = await pool.query(
    `INSERT INTO servers
    (name,status,cpu_usage,memory_usage)
    VALUES($1,$2,$3,$4)
    RETURNING *`,
    [
      name,
      status,
      cpu_usage,
      memory_usage
    ]
  );

  res.json(result.rows[0]);
});

// 削除
app.delete("/api/servers/:id", async (req, res) => {

  await pool.query(
    "DELETE FROM servers WHERE id=$1",
    [req.params.id]
  );

  res.json({
    message:"削除しました"
  });

});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});