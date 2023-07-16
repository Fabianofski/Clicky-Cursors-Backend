import express from "express";
import { SaveData } from "./model/SaveData";
require("dotenv").config();

const mongo = require("./mongo");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const app = express();
const port = 3000;

const cors = require("cors");
app.use(cors());

app.get("/clicky-cursors", (req, res) => {
  const uptime = process.uptime(); // Uptime in Sekunden
  res.send({ uptime: uptime.toFixed(2) + "s" });
});

app.post("/clicky-cursors/api/save", jsonParser, async (req, res) => {
  const { username, password } = req.query;

  if (username == "" || password == "") {
    res.sendStatus(422);
    return;
  }

  const body = req.body as SaveData;
  const response = await mongo.updateSaveData(body, username, password);

  res.send({ response: response });
});

app.get("/clicky-cursors/api/load", jsonParser, async (req, res) => {
  const { username, password } = req.query;
  const response = await mongo.getSaveData(username, password);

  res.send(response);
});

app.get("/clicky-cursors/api/userExists", jsonParser, async (req, res) => {
  const { username } = req.query;
  const response = await mongo.userExists(username);

  res.send(response);
});

app.get("/clicky-cursors/api/login", jsonParser, async (req, res) => {
  const { username, password } = req.query;
  const response = await mongo.login(username, password);

  res.send(response);
});

app.get("/clicky-cursors/api/leaderboard", jsonParser, async (req, res) => {
  const response = await mongo.getLeaderboard();

  res.send(response);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
