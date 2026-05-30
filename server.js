const express = require("express");
const app = express();

app.use(express.json());

/* =========================
   DADOS
========================= */
let users = [
  { user: "admin", pass: "1234", credits: 200 }
];

let keys = [];

/* =========================
   LOGIN
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
        text-shadow:0 0 10px white;
      }

      .status {
        text-align:center;
        color:#00ff88;
        margin-top:10px;
        text-shadow:0 0 10px #00ff88;
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
        50%{transform:scale(1.5);}
        100%{transform:scale(1);}
      }

      .box {
        width:320px;
        margin:40px auto;
        background:#111;
        padding:20px;
        border-radius:10px;
        box-shadow:0 0 20px white;
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
            alert("Login inválido");
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
   DASHBOARD
========================= */
app.get("/dashboard", (req, res) => {

  let user = users[0];

  let list = "";
  keys.slice().reverse().forEach(k=>{
    list += `<div style="padding:5px;border-bottom:1px solid #222">${k.key}</div>`;
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
        text-shadow:0 0 10px white;
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
        box-shadow:0 0 10px #222;
      }

      .panel {
        width:400px;
        margin:30px auto;
        background:#111;
        padding:20px;
        border-radius:10px;
        box-shadow:0 0 15px white;
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
        font-weight:bold;
      }

      /* MODAL */
      .modal {
        display:none;
        position:fixed;
        top:0;left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.9);
        justify-content:center;
        align-items:center;
      }

      .modalBox {
        width:400px;
        background:#111;
        padding:20px;
        border-radius:10px;
        box-shadow:0 0 20px white;
        text-align:center;
      }

    </style>
  </head>

  <body>

    <div class="top">📺 Companhia Shelby Panel</div>

    <div class="cards">
      <div class="card">💰 Créditos<br>${user.credits}</div>
      <div class="card">🔑 Keys<br>${keys.length}</div>
    </div>

    <div class="panel">

      <h3>Gerar Keys</h3>

      <div class="shop">

        <div class="item">1 Dia<br>10 créditos<br><button onclick="set('1d',10)">Selecionar</button></div>
        <div class="item">3 Dias<br>35 créditos<br><button onclick="set('3d',35)">Selecionar</button></div>
        <div class="item">7 Dias<br>55 créditos<br><button onclick="set('7d',55)">Selecionar</button></div>
        <div class="item">30 Dias<br>100 créditos<br><button onclick="set('30d',100)">Selecionar</button></div>

      </div>

      <div style="text-align:center;margin-top:10px;">
        <button onclick="minus()">-</button>
        <span id="qtd">1</span>
        <button onclick="plus()">+</button>
      </div>

      <button onclick="gen()">GERAR KEYS</button>

    </div>

    <!-- MODAL -->
    <div id="modal" class="modal">
      <div class="modalBox">
        <h3>🔑 Keys Geradas</h3>

        <div id="keysBox"></div>

        <button onclick="copy()">Copiar Todas</button>
        <button onclick="closeModal()">Fechar</button>
      </div>
    </div>

    <script>

      let type="1d";
      let cost=10;
      let qtd=1;
      let lastKeys=[];

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
          body:JSON.stringify({type,qtd,cost})
        })
        .then(r=>r.json())
        .then(d=>{
          if(d.error) return alert("Sem créditos");

          lastKeys = d.keys;

          let box = document.getElementById("keysBox");
          box.innerHTML="";

          d.keys.forEach(k=>{
            box.innerHTML += "<div>"+k+"</div>";
          });

          document.getElementById("modal").style.display="flex";
        });
      }

      function closeModal(){
        document.getElementById("modal").style.display="none";
        location.reload();
      }

      function copy(){
        navigator.clipboard.writeText(lastKeys.join("\\n"));
        alert("Copiado!");
      }

    </script>

  </body>
  </html>
  `);
});

/* =========================
   GERAR KEYS
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

  let created = [];

  for(let i=0;i<qtd;i++){
    let key = "SHELBY-" + Math.random().toString(36).substring(2,8).toUpperCase();

    keys.push({ key, type });

    created.push(key);
  }

  res.json({ ok:true, keys:created });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Shelby PRO online");
});
