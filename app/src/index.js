const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const port = 3000;

const dbConfig = {
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "rootpassword",
  database: process.env.DB_NAME || "nodedb",
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureDatabaseReady(maxRetries = 30) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!pool) {
        pool = mysql.createPool(dbConfig);
      }
      await pool.query("SELECT 1");
      await pool.query(`
        CREATE TABLE IF NOT EXISTS people (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          PRIMARY KEY (id)
        )
      `);
      return;
    } catch (err) {
      lastError = err;
      await sleep(2000);
    }
  }
  throw lastError || new Error("Database not ready");
}

function generateName() {
  const adjectives = [
    "Amazing",
    "Brilliant",
    "Creative",
    "Dynamic",
    "Epic",
    "Fearless",
  ];
  const animals = ["Falcon", "Lion", "Tiger", "Eagle", "Wolf", "Panther"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adjective} ${animal} ${Date.now()}`;
}

app.get("/", async (_req, res) => {
  try {
    await ensureDatabaseReady();
    const name = generateName();
    await pool.query("INSERT INTO people (name) VALUES (?)", [name]);

    const [rows] = await pool.query("SELECT name FROM people ORDER BY id DESC");
    const listItems = rows.map((r) => `<li>${r.name}</li>`).join("");
    const html = `
      <h1>Full Cycle Rocks!</h1>
      <ul>
      ${listItems}
      </ul>
    `;
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
