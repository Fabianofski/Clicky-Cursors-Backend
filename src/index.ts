import express from "express";
import { SaveData } from "./model/SaveData";
require("dotenv").config();

const API_KEY = process.env.API_KEY;
const mongo = require("./mongo");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const uptime = process.uptime(); // Uptime in Sekunden
  res.send({ uptime: uptime.toFixed(2) + "s" });
});

app.post("/api/save", jsonParser, async (req, res) => {
  const { username, password, apiKey } = req.query;

  if (apiKey !== API_KEY) {
    res.sendStatus(403);
    return;
  }

  const body = req.body as SaveData;
  const response = await mongo.updateSaveData(body, username, password);

  res.send({ response: response });
});

app.get("/api/load", jsonParser, async (req, res) => {
  const { username, password } = req.query;
  const response = await mongo.getSaveData(username, password);

  res.send(response);
});

app.get("/api/userExists", jsonParser, async (req, res) => {
  const { username } = req.query;
  const response = await mongo.userExists(username);

  res.send(response);
});

app.get("/api/login", jsonParser, async (req, res) => {
  const { username, password } = req.query;
  const response = await mongo.login(username, password);

  res.send(response);
});

app.get("/api/leaderboard", jsonParser, async (req, res) => {
  const response = await mongo.getLeaderboard();

  res.send(response);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
