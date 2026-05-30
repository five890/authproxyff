const express = require("express");
const app = express();

app.use(express.json());

/* =========================
   BANCO SIMPLES EM MEMÓRIA
========================= */
let users = [
  { user: "admin", pass: "1234", credits: 200 }
];

let sessions = {};
let keys = [];

/* =========================
   LOGIN PAGE
========================= */
app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Companhia Shelby</title>
    <style>
      body {
        margin:0;
        background:black;
        color:white;
        font-family:Arial;
      }

      .title {
        text-align:center;
        font-size:30px;
        margin-top:30px;
        font-weight:bold;
      }

      .status {
        text-align:center;
        color:#00ff88;
        margin-top:10px;
      }

      .dot {
        width:10px;
        height:10px;
        background:#00ff88;
        border-radius:50%;
        display:inline-block;
        animation:pulse 1s infinite;
      }

      @keyframes pulse {
        0%{transform:scale(1);}
        50%{transform:scale(1.4);}
        100%{transform:scale(1);}
      }

      .box {
        width:320px;
        margin:40px auto;
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
        font-weight:bold;
      }
    </style>
  </head>

  <body>

    <div class="title">🏢 Companhia Shelby</div>

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
        fetch("/login",{
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
            window.location="/dashboard";
          } else {
            alert("login inválido");
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

  res.json({ ok:true });
});

/* =========================
   DASHBOARD (KEY PANEL)
========================= */
app.get("/dashboard", (req, res) => {

  let user = users[0];

  let list = "";

  keys.slice().reverse().forEach((k,i)=>{
    list += `
      <div style="padding:8px;border-bottom:1px solid #222;">
        ${k.type} → ${k.key}
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
        background:black;
        color:white;
        font-family:Arial;
      }

      .top {
        text-align:center;
        padding:20px;
        background:#111;
        font-size:22px;
        font-weight:bold;
      }

      .cards {
        display:flex;
        justify-content:center;
        gap:20px;
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
        margin:30px auto;
        background:#111;
        padding:20px;
        border-radius:10px;
      }

      .shop {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
      }

      .item {
        background:#000;
        border:1px solid #333;
        padding:10px;
        text-align:center;
        border-radius:10px;
      }

      button {
        width:100%;
        padding:10px;
        margin-top:10px;
        background:white;
        border:none;
        cursor:pointer;
      }

      .qtd {
        display:flex;
        justify-content:center;
        align-items:center;
        gap:10px;
      }
    </style>
  </head>

  <body>

    <div class="top">📺 Companhia Shelby Panel</div>

    <div class="cards">
      <div class="card">
        💰 Créditos<br>${user.credits}
      </div>

      <div class="card">
        🔑 Keys<br>${keys.length}
      </div>
    </div>

    <div class="panel">

      <h3>Gerar Keys</h3>

      <div class="shop">

        <div class="item">1 Dia<br>10 créditos<br><button onclick="set('1d',10)">Selecionar</button></div>
        <div class="item">3 Dias<br>35 créditos<br><button onclick="set('3d',35)">Selecionar</button></div>
        <div class="item">7 Dias<br>55 créditos<br><button onclick="set('7d',55)">Selecionar</button></div>
        <div class="item">30 Dias<br>100 créditos<br><button onclick="set('30d',100)">Selecionar</button></div>

      </div>

      <br>

      <div class="qtd">
        <button onclick="minus()">-</button>
        <div id="qtd">1</div>
        <button onclick="plus()">+</button>
      </div>

      <button onclick="gen()">GERAR KEYS</button>

      <h4>Keys</h4>
      ${list}

    </div>

    <script>
      let type="1d";
      let cost=10;
      let qtd=1;

      function set(t,c){
        type=t;
        cost=c;
      }

      function plus(){
        qtd++;
        document.getElementById("qtd").innerText=qtd;
      }

      function minus(){
        if(qtd>1){
          qtd--;
          document.getElementById("qtd").innerText=qtd;
        }
      }

      function gen(){
        fetch("/generate-key",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            type,
            qtd,
            cost
          })
        }).then(()=>location.reload());
      }
    </script>

  </body>
  </html>
  `);
});

/* =========================
   GERAR KEYS + CREDITOS
========================= */
app.post("/generate-key", (req, res) => {

  let { type, qtd, cost } = req.body;

  qtd = parseInt(qtd);

  let user = users[0];

  let total = qtd * cost;

  if(user.credits < total){
    return res.json({ error:"sem creditos" });
  }

  user.credits -= total;

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
  console.log("Shelby PRO online");
});
