const express = require("express");
const app = express();

app.use(express.json());

let logs = [];

app.get("/", (req, res) => {
  res.send("Shelby online");
});

app.get("/update-ip", (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "sem ip";

  logs.push({ ip, time: new Date().toISOString() });

  res.json({ success: true, ip });
});

app.get("/logs", (req, res) => {
  res.json(logs);
});

app.get("/clear", (req, res) => {
  logs = [];
  res.json({ ok: true });
});

// IMPORTANTE PRO RAILWAY
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Rodando na porta " + PORT);
});
