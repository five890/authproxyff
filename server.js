const express = require("express");
const app = express();

app.use(express.json());

// rota principal
app.get("/", (req, res) => {
  res.send("API online");
});

// pegar IP
app.get("/update-ip", (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "sem ip";

  res.json({
    success: true,
    ip: ip
  });
});

// porta do Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
