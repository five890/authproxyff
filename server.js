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
    let html = `
    <html>
    <body style="background:#0f0f0f;color:white;font-family:Arial;text-align:center;">
    <h1>Shelby PRO Dashboard</h1>
    <button onclick="location.reload()">Atualizar</button>
    <button onclick="fetch('/clear').then(()=>location.reload())">Limpar</button>
    <table border="1" style="margin:auto;width:80%;margin-top:20px;">
      <tr><th>ID</th><th>IP</th><th>Hora</th></tr>
    `;

    rows.forEach(r => {
      html += `<tr><td>${r.id}</td><td>${r.ip}</td><td>${r.time}</td></tr>`;
    });

    html += "</table></body></html>";

    res.send(html);
  });
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
