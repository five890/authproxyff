const express = require("express");
const app = express();

app.use(express.json());

// rota principal
app.get("/", (req, res) => {
  res.send("Shelby Company online");
});

// pegar IP real (Railway / proxy safe)
app.get("/update-ip", (req, res) => {
  const forwarded = req.headers["x-forwarded-for"];
  const realIp = req.headers["x-real-ip"];

  const ip =
    (forwarded ? forwarded.split(",")[0].trim() : null) ||
    realIp ||
    req.socket.remoteAddress ||
    "sem ip";

  res.json({
    success: true,
    ip: ip
  });
});

// porta Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
