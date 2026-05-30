const express = require("express");
const app = express();

app.use(express.json());

let logs = [];

// HOME
app.get("/", (req, res) => {
  res.send("Shelby PRO online");
});

// IP
app.get("/update-ip", (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "sem ip";

  logs.push({ ip, time: new Date().toISOString() });

  res.json({ success: true, ip });
});

// PANEL
app.get("/panel", (req, res) => {
  res.send(`
    <html>
      <body style="background:#111;color:white;text-align:center;padding-top:50px;font-family:Arial;">
        <h1>Shelby Panel</h1>
        <button onclick="location.href='/dashboard'">Ir para Dashboard</button>
      </body>
    </html>
  `);
});

// DASHBOARD (SEM ERRO)
app.get("/dashboard", (req, res) => {

  let rows = "";

  logs.forEach((l, i) => {
    rows += `<tr><td>${i + 1}</td><td>${l.ip}</td><td>${l.time}</td></tr>`;
  });

  res.send(`
    <html>
      <body style="background:#0f0f0f;color:white;font-family:Arial;text-align:center;">
        <h1>Dashboard</h1>

        <button onclick="location.reload()">Atualizar</button>
        <button onclick="fetch('/clear').then(()=>location.reload())">Limpar</button>

        <table border="1" style="margin:auto;width:80%;margin-top:20px;">
          <tr><th>ID</th><th>IP</th><th>Hora</th></tr>
          ${rows}
        </table>
      </body>
    </html>
  `);
});

// CLEAR
app.get("/clear", (req, res) => {
  logs = [];
  res.json({ ok: true });
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Rodando na porta " + PORT);
});
