const express = require("express");
const app = express();

let savedIP = "sem ip";

app.get("/update-ip", (req, res) => {
  const ip = req.query.ip || req.ip;
  savedIP = ip;
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Shelby Company</title>
<style>
body{
    background:#000;
    color:#fff;
    font-family:Arial,sans-serif;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    margin:0;
}
.card{
    border:2px solid #fff;
    padding:30px;
    text-align:center;
    box-shadow:0 0 20px #fff;
    border-radius:10px;
}
h1{
    text-transform:uppercase;
    letter-spacing:3px;
}
</style>
</head>
<body>
<div class="card">
    <h1>Shelby Company</h1>
    <p>IP atualizado com sucesso</p>
    <p>${savedIP}</p>
</div>
</body>
</html>
`);
});

app.get("/", (req, res) => {
  res.send(savedIP);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor online");
});
