const express = require('express');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const db = new sqlite3.Database('./ips.db', (err) => {
  if (err) {
    console.error("Erro ao conectar no banco SQLite:", err);
  } else {
    console.log("Conectado ao banco SQLite.");
  }
});

// Cria tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS ips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Salva IP no banco
  db.run('INSERT INTO ips(ip) VALUES(?)', [ip], (err) => {
    if (err) {
      console.error('Erro ao salvar IP:', err);
    } else {
      console.log(`IP salvo: ${ip}`);
    }
  });

  res.send('Olá, IP registrado!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
