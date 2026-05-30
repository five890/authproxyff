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

  logs.slice().reverse().forEach((l, i) => {
    rows += `
      <tr>
        <td>${i + 1}</td>
        <td>${l.ip}</td>
        <td>${l.time}</td>
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
        background: #0b0f19;
        color: white;
      }

      .header {
        padding: 20px;
        background: #111827;
        font-size: 22px;
        font-weight: bold;
        text-align: center;
        border-bottom: 1px solid #222;
      }

      .cards {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
      }

      .card {
        background: #111827;
        padding: 20px;
        border-radius: 10px;
        width: 200px;
        text-align: center;
        box-shadow: 0 0 10px rgba(0,0,0,0.4);
      }

      table {
        width: 90%;
        margin: 30px auto;
        border-collapse: collapse;
        background: #111827;
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
        background: #1b2436;
      }

      .buttons {
        text-align: center;
        margin-top: 20px;
      }

      button {
        padding: 10px 15px;
        margin: 5px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        background: #3b82f6;
        color: white;
      }

      button:hover {
        background: #2563eb;
      }
    </style>
  </head>

  <body>

    <div class="header">
      🛡 Shelby PRO Dashboard
    </div>

    <div class="cards">
      <div class="card">
        <h2>${logs.length}</h2>
        <p>Total Logs</p>
      </div>

      <div class="card">
        <h2>ONLINE</h2>
        <p>Status</p>
      </div>
    </div>

    <div class="buttons">
      <button onclick="location.reload()">Atualizar</button>
      <button onclick="fetch('/clear').then(()=>location.reload())">Limpar Logs</button>
    </div>

    <table>
      <tr>
        <th>#</th>
        <th>IP</th>
        <th>Hora</th>
      </tr>
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
