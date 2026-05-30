const express = require("express");
const app = express();

app.use(express.json());

// banco em memória (temporário)
let logs = [];

// HOME
app.get("/", (req, res) => {
  res.send("Shelby Auth System online");
});

// PEGAR IP E SALVAR LOG
app.get("/update-ip", (req, res) => {
  const forwarded = req.headers["x-forwarded-for"];
  const realIp = req.headers["x-real-ip"];

  const ip =
    (forwarded ? forwarded.split(",")[0].trim() : null) ||
    realIp ||
    req.socket.remoteAddress ||
    "sem ip";

  logs.push({
    ip: ip,
    time: new Date().toISOString()
  });

  res.json({
    success: true,
    ip: ip
  });
});

// VER LOGS JSON
app.get("/logs", (req, res) => {
  res.json({
    total: logs.length,
    logs: logs
  });
});

// LIMPAR LOGS
app.get("/clear", (req, res) => {
  logs = [];
  res.json({
    success: true,
    message: "logs limpos"
  });
});

// PAINEL WEB
app.get("/panel", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Shelby Panel</title>
        <style>
          body {
            background: #0f0f0f;
            color: white;
            font-family: Arial;
            text-align: center;
            padding-top: 50px;
          }
          .box {
            background: #1c1c1c;
            padding: 20px;
            border-radius: 10px;
            display: inline-block;
          }
          button {
            padding: 10px;
            margin: 10px;
            cursor: pointer;
            border: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Shelby Panel</h1>
          <p>API Online</p>

          <button onclick="fetch('/logs').then(r=>r.json()).then(d=>alert(JSON.stringify(d, null, 2)))">
            Ver Logs
          </button>

          <button onclick="fetch('/clear').then(r=>r.json()).then(d=>alert(d.message))">
            Limpar Logs
          </button>
        </div>
      </body>
    </html>
  `);
});

// PORTA RAILWAY
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
