const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/registrar-ip", (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  const log = `${new Date().toISOString()} - IP: ${ip}\n`;
  fs.appendFile("ips.txt", log, (err) => {
    if (err) console.error("Erro:", err);
  });
  res.send("IP registrado");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
