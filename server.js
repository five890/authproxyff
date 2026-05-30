const express = require("express");
const app = express();

app.use(express.json());

// banco em memória
let logs = [];

// senha do painel (muda aqui)
const ADMIN_PASSWORD = "1234";

// HOME
app.get("/", (req, res) => {
  res.send("Shelby System online");
});

// IP LOGGER
app.get("/update-ip", (req, res) => {
  const forwarded = req.headers["x-forwarded-for"];
  const realIp = req.headers["x-real-ip"];

  const ip =
    (forwarded ? forwarded.split(",")[0].trim() : null) ||
    realIp ||
    req.socket.remoteAddress ||
    "sem ip";

  logs.push({
    ip,
    time: new Date().toISOString()
  });

  res.json({ success: true, ip });
});

// LOGIN PAGE
app.get("/panel", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Login Panel</title>
        <style>
          body {
            background: #0f0f0f;
            color: white;
            font-family: Arial;
            text-align: center;
            padding-top: 100px;
          }
          input {
            padding: 10px;
            border-radius: 5px;
            border: none;
          }
          button {
            padding: 10px;
            margin-top: 10px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h2>Login Painel</h2>
        <input id="pass" type="password" placeholder="senha" />
        <br>
        <button onclick="login()">Entrar</button>

        <script>
          function login() {
            const pass = document.getElementById('pass').value;

            if(pass === "${ADMIN_PASSWORD}") {
              window.location.href = "/dashboard";
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
  res.send(`
    <html>
      <head>
        <title>Dashboard</title>
        <style>
          body {
            background: #111;
            color: white;
            font-family: Arial;
            text-align: center;
            padding: 20px;
          }
          table {
            margin: auto;
            border-collapse: collapse;
            width: 80%;
          }
          th, td {
            border: 1px solid #444;
            padding: 10px;
          }
          th {
            background: #222;
          }
          button {
            margin: 10px;
            padding: 10px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h1>Shelby Dashboard</h1>

        <button onclick="fetch('/logs').then(r=>r.json()).then(show)">Atualizar Logs</button>
        <button onclick="fetch('/clear').then(()=>location.reload())">Limpar Logs</button>

        <div id="table"></div>

        <script>
          function show(data) {
            let html = "<table><tr><th>IP</th><th>Data</th></tr>";

            data.logs.forEach(l => {
              html += `<tr><td>${l.ip}</td><td>${l.time}</td></tr>`;
            });

            html += "</table>";
            document.getElementById("table").innerHTML = html;
          }
        </script>
      </body>
    </html>
  `);
});

// LOGS API
app.get("/logs", (req, res) => {
  res.json({ total: logs.length, logs });
});

// CLEAR
app.get("/clear", (req, res) => {
  logs = [];
  res.json({ success: true });
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Rodando na porta " + PORT);
});
