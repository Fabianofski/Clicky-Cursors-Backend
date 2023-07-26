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
  const uptime = process.uptime();
  res.send({ uptime: uptime.toFixed(2) + "s" });
});

function getUsernameAndPassword(req: any): {
  username: string;
  password: string;
} {
  try {
    let username, password;
    if (req.headers.authorization) {
      const base64Credentials = req.headers.authorization.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString(
        "utf8"
      );
      [username, password] = credentials.split(":");
    } else {
      username = req.query.username;
      password = req.query.password;
    }
    return { username: username || "", password: password || "" };
  } catch {
    return { username: "", password: "" };
  }
}

app.post("/clicky-cursors/api/save", jsonParser, async (req, res) => {
  const { username, password } = getUsernameAndPassword(req);
  if (username === "" || password === "") {
    res.sendStatus(422);
    return;
  }

  const body = req.body as SaveData;
  const response = await mongo.updateSaveData(body, username, password);

  res.send({ response: response });
});

app.get("/clicky-cursors/api/load", jsonParser, async (req, res) => {
  const { username, password } = getUsernameAndPassword(req);
  if (username === "" || password === "") {
    res.sendStatus(422);
    return;
  }

  const response = await mongo.getSaveData(username, password);

  res.send(response);
});

app.get("/clicky-cursors/api/userExists", jsonParser, async (req, res) => {
  const { username } = req.query;
  const response = await mongo.userExists(username);

  res.send(response);
});

app.get("/clicky-cursors/api/login", jsonParser, async (req, res) => {
  const { username, password } = getUsernameAndPassword(req);
  if (username === "" || password === "") {
    res.sendStatus(422);
    return;
  }

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
