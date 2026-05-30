const express = require("express");
const app = express();

app.use(express.json());

// banco em memória
let logs = [];

// senha do painel
const ADMIN_PASSWORD = "1234";

// HOME
app.get("/", (req, res) => {
  res.send("Shelby System online");
});

// CAPTURA IP
app.get("/update-ip", (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "sem ip";

  logs.push({
    ip,
    time: new Date().toISOString()
  });

  res.json({ success: true, ip });
});

// LOGIN
app.get("/panel", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Login</title>
      </head>
      <body style="background:#111;color:white;text-align:center;padding-top:100px;font-family:Arial;">
        <h2>Login Painel</h2>
        <input id="pass" type="password" placeholder="senha" />
        <br><br>
        <button onclick="login()">Entrar</button>

        <script>
          function login() {
            const pass = document.getElementById("pass").value;
            if(pass === "${ADMIN_PASSWORD}") {
              window.location.href = "/dashboard";
            } else {
              alert("Senha incorreta");
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
            background: #0f0f0f;
            color: white;
            font-family: Arial;
            text-align: center;
          }
          table {
            margin: auto;
            border-collapse: collapse;
            width: 80%;
          }
          th, td {
            border: 1px solid #333;
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

        <button onclick="load()">Atualizar Logs</button>
        <button onclick="fetch('/clear').then(()=>location.reload())">Limpar Logs</button>

        <div id="table"></div>

        <script>
          function load() {
            fetch('/logs')
              .then(r => r.json())
              .then(data => {
                let html = "<table><tr><th>IP</th><th>Hora</th></tr>";

                data.forEach(l => {
                  html += `<tr><td>${l.ip}</td><td>${l.time}</td></tr>`;
                });

                html += "</table>";
                document.getElementById("table").innerHTML = html;
              });
          }

          load();
        </script>
      </body>
    </html>
  `);
});

// LOGS API
app.get("/logs", (req, res) => {
  res.json(logs);
});

// CLEAR LOGS
app.get("/clear", (req, res) => {
  logs = [];
  res.json({ success: true });
});

// PORTA RAILWAY
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Rodando na porta " + PORT);
});
