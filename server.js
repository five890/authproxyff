const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(express.json());

// BANCO
const db = new sqlite3.Database("./logs.db");

// cria tabela
db.run(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT,
    time TEXT
  )
`);

// HOME
app.get("/", (req, res) => {
  res.send("Shelby PRO online");
});

// CAPTURA IP
app.get("/update-ip", (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "sem ip";

  const time = new Date().toISOString();

  db.run("INSERT INTO logs (ip, time) VALUES (?, ?)", [ip, time]);

  res.json({ success: true, ip });
});

// LOGIN PANEL
app.get("/panel", (req, res) => {
  res.send(`
    <html>
      <body style="background:#111;color:white;text-align:center;padding-top:80px;font-family:Arial;">
        <h2>Login Shelby PRO</h2>
        <input id="pass" type="password" placeholder="senha" />
        <br><br>
        <button onclick="login()">Entrar</button>

        <script>
          function login(){
            if(document.getElementById("pass").value === "1234"){
              window.location.href="/dashboard";
            } else {
              alert("Senha errada");
            }
          }
        </script>
      </body>
    </html>
  `);
});

// DASHBOARD
app.get("/dashboard", (req, res) => {
  db.all("SELECT * FROM logs ORDER BY id DESC", (err, rows) => {
    let tableRows = "";

    rows.forEach(r => {
      tableRows += `
        <tr>
          <td>${r.id}</td>
          <td>${r.ip}</td>
          <td>${r.time}</td>
        </tr>
      `;
    });

    res.send(`
      <html>
      <head>
        <title>Shelby PRO Dashboard</title>
        <style>
          body {
            margin: 0;
            font-family: Arial;
            background: #0d1117;
            color: #fff;
          }

          .topbar {
            background: #161b22;
            padding: 20px;
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            border-bottom: 1px solid #222;
          }

          .container {
            padding: 20px;
          }

          .buttons {
            margin-bottom: 20px;
          }

          button {
            background: #238636;
            border: none;
            padding: 10px 15px;
            color: white;
            border-radius: 8px;
            cursor: pointer;
            margin-right: 10px;
          }

          button:hover {
            background: #2ea043;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            background: #161b22;
            border-radius: 10px;
            overflow: hidden;
          }

          th, td {
            padding: 12px;
            border-bottom: 1px solid #222;
            text-align: center;
          }

          th {
            background: #1f2937;
          }

          tr:hover {
            background: #222;
          }
        </style>
      </head>

      <body>
        <div class="topbar">
          Shelby PRO Dashboard
        </div>

        <div class="container">

          <div class="buttons">
            <button onclick="location.reload()">Atualizar</button>
            <button onclick="fetch('/clear').then(()=>location.reload())">Limpar Logs</button>
          </div>

          <table>
            <tr>
              <th>ID</th>
              <th>IP</th>
              <th>Hora</th>
            </tr>
            ${tableRows}
          </table>

        </div>
      </body>
      </html>
    `);
  });

// LIMPAR LOGS
app.get("/clear", (req, res) => {
  db.run("DELETE FROM logs");
  res.json({ success: true });
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Shelby PRO rodando na porta " + PORT);
});
