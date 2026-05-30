const express = require("express");
const app = express();

app.use(express.json());

let logs = [];

// LOGIN SIMPLES (sessão fake)
let logged = false;

// HOME (LOGIN)
app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Login</title>
    <style>
      body {
        margin: 0;
        background: #0b0f19;
        color: white;
        font-family: Arial;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .box {
        background: #111827;
        padding: 30px;
        border-radius: 12px;
        width: 300px;
        text-align: center;
      }

      input {
        width: 100%;
        padding: 10px;
        margin-top: 10px;
        border-radius: 6px;
        border: none;
      }

      button {
        width: 100%;
        padding: 10px;
        margin-top: 15px;
        border: none;
        border-radius: 6px;
        background: #3b82f6;
        color: white;
        cursor: pointer;
      }
    </style>
  </head>

  <body>

    <div class="box">
      <h2>🔐 Shelby Login</h2>

      <input id="user" placeholder="usuário" />
      <input id="pass" type="password" placeholder="senha" />

      <button onclick="login()">Entrar</button>
    </div>

    <script>
      function login(){
        const u = document.getElementById("user").value;
        const p = document.getElementById("pass").value;

        if(u === "admin" && p === "1234"){
          window.location.href = "/dashboard";
        } else {
          alert("Login inválido");
        }
      }
    </script>

  </body>
  </html>
  `);
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

// DASHBOARD (PROTECTED)
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
    <title>Dashboard</title>
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
        text-align: center;
        font-size: 22px;
        font-weight: bold;
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
      }

      table {
        width: 90%;
        margin: 30px auto;
        border-collapse: collapse;
        background: #111827;
      }

      th, td {
        padding: 10px;
        border-bottom: 1px solid #222;
        text-align: center;
      }

      th {
        background: #1f2937;
      }

      button {
        padding: 10px;
        margin: 5px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        background: #3b82f6;
        color: white;
      }
    </style>
  </head>

  <body>

    <div class="header">
      🛡 Shelby Dashboard
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

    <div style="text-align:center;">
      <button onclick="location.reload()">Atualizar</button>
      <button onclick="fetch('/clear').then(()=>location.reload())">Limpar</button>
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
