const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("API online");
});

app.get("/panel", (req, res) => {
  res.send("panel ok");
});

app.get("/update-ip", (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "sem ip";

  res.json({ ip });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Rodando na porta " + PORT);
});
