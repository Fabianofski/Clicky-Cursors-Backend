import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const uptime = process.uptime(); // Uptime in Sekunden
  res.send({ uptime: uptime.toFixed(2) + "s" });
});

app.get("/", (req, res) => {});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
