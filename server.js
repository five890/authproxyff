const express = require("express");
const app = express();

app.use(express.json());

/* =========================
   USUÁRIOS (COM CREDITOS)
========================= */
let users = [
  { user: "admin", pass: "1234", credits: 100 }
];

let sessions = {};
let keys = [];

/* =========================
   LOGIN PAGE (NETFLIX STYLE)
========================= */
app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Companhia Shelby</title>

    <style>
      body {
        margin:0;
        font-family: Arial;
        background: black;
        color: white;
      }

      .top {
        text-align:center;
        padding:20px;
        font-size:28px;
        font-weight:bold;
      }

      .status {
        text-align:center;
        color:#00ff88;
        margin-bottom:20px;
      }

      .dot {
        height:10px;
        width:10px;
        background:#00ff88;
        border-radius:50%;
        display:inline-block;
        animation:pulse 1s infinite;
        margin-right:6px;
      }

      @keyframes pulse {
        0% {transform:scale(1);}
        50% {transform:scale(1.5);}
        100% {transform:scale(1);}
      }

      .box {
        width:320px;
        margin:auto;
        margin-top:40px;
        background:#111;
        padding:25px;
        border-radius:10px;
        box-shadow:0 0 20px #222;
      }

      input {
        width:100%;
        padding:10px;
        margin-top:10px;
        background:#000;
        border:1px solid #333;
        color:white;
      }

      button {
        width:100%;
        padding:10px;
        margin-top:15px;
        background:white;
        color:black;
        border:none;
        cursor:pointer;
        font-weight:bold;
      }
    </style>
  </head>

  <body>

    <div class="top">🏢 Companhia Shelby</div>

    <div class="status">
      <span class="dot"></span> Servidor Online
    </div>

    <div class="box">
      <h3>Login</h3>

      <input id="user" placeholder="usuario">
      <input id="pass" type="password" placeholder="senha">

      <button onclick="login()">Entrar</button>
    </div>

    <script>
      function login(){
        fetch("/login", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            user:document.getElementById("user").value,
            pass:document.getElementById("pass").value
          })
        })
        .then(r=>r.json())
        .then(d=>{
          if(d.ok){
            window.location="/dashboard?u="+d.user;
          } else {
            alert("erro login");
          }
        })
      }
    </script>

  </body>
  </html>
  `);
});

/* =========================
   LOGIN BACKEND
========================= */
app.post("/login", (req, res) => {
  const { user, pass } = req.body;

  const u = users.find(x => x.user === user && x.pass === pass);

  if(!u) return res.json({ ok:false });

  const token = Math.random().toString(36).substring(2);

  sessions[token] = user;

  res.json({ ok:true, user, token });
});

/* =========================
   DASHBOARD (NETFLIX STYLE)
========================= */
app.get("/dashboard", (req, res) => {

  let user = users[0];

  let keyList = "";

  keys.slice().reverse().forEach((k,i)=>{
    keyList += `
      <div style="padding:8px;border-bottom:1px solid #222;">
        ${k.type} - ${k.key}
      </div>
    `;
  });

  res.send(`
  <html>
  <head>
    <title>Dashboard</title>
    <style>
      body {
        margin:0;
        font-family:Arial;
        background:black;
        color:white;
      }

      .top {
        padding:20px;
        text-align:center;
        font-size:22px;
        background:#111;
      }

      .grid {
        display:flex;
        gap:15px;
        justify-content:center;
        margin-top:20px;
      }

      .card {
        background:#111;
        padding:15px;
        width:150px;
        text-align:center;
        border-radius:10px;
      }

      .panel {
        width:400px;
        margin:auto;
        margin-top:30px;
        background:#111;
        padding:20px;
        border-radius:10px;
      }

      input {
        width:100%;
        padding:10px;
        margin-top:10px;
        background:black;
        color:white;
        border:1px solid #333;
      }

      button {
        width:100%;
        padding:10px;
        margin-top:10px;
        background:white;
        border:none;
        cursor:pointer;
      }
    </style>
  </head>

  <body>

    <div class="top">
      📺 Companhia Shelby Dashboard
    </div>

    <div class="grid">
      <div class="card">
        💰 Créditos<br>${user.credits}
      </div>

      <div class="card">
        🔑 Keys<br>${keys.length}
      </div>
    </div>

    <div class="panel">

      <h3>Gerar Keys</h3>

      <input id="type" placeholder="1d / 3d / 7d / 30d">
      <input id="qtd" placeholder="quantidade">

      <button onclick="gen()">Gerar</button>

      <h4>Keys geradas</h4>
      ${keyList}

    </div>

    <script>
      function gen(){
        fetch("/generate-key",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            type:document.getElementById("type").value,
            qtd:document.getElementById("qtd").value
          })
        }).then(()=>location.reload());
      }
    </script>

  </body>
  </html>
  `);
});

/* =========================
   GERAR KEYS (COM CREDITOS)
========================= */
app.post("/generate-key", (req, res) => {

  let { type, qtd } = req.body;

  qtd = parseInt(qtd || 1);

  const user = users[0];

  if(user.credits < qtd){
    return res.json({ error:"sem creditos" });
  }

  user.credits -= qtd;

  for(let i=0;i<qtd;i++){
    keys.push({
      type,
      key: "SHELBY-" + Math.random().toString(36).substring(2,8).toUpperCase()
    });
  }

  res.json({ ok:true });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Shelby PRO rodando");
});
