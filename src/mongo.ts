import { SaveData } from "./model/SaveData";

var MongoClient = require("mongodb").MongoClient;

const uri = `mongodb+srv://${process.env.MONGO_AUTH}@${process.env.MONGO_HOST}`;
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function userExists(displayName: string): Promise<boolean> {
  try {
    const client = new MongoClient(uri);

    const db = client.db("ClickyCursor");
    const collection = db.collection("ClickyCursorData");

    const oldSaveData = (await collection.findOne({
      displayName: displayName,
    })) as SaveData;
    return oldSaveData !== null;
  } catch {
    return false;
  }
}

async function login(displayName: string, password: string): Promise<boolean> {
  try {
    const client = new MongoClient(uri);

    const db = client.db("ClickyCursor");
    const collection = db.collection("ClickyCursorData");

    const oldSaveData = (await collection.findOne({
      displayName: displayName,
    })) as SaveData;
    return await bcrypt.compare(password, oldSaveData.password);
  } catch {
    return false;
  }
}

async function updateSaveData(
  saveData: SaveData,
  displayName: string,
  password: string
) {
  try {
    const client = new MongoClient(uri);

    const db = client.db("ClickyCursor");
    const collection = db.collection("ClickyCursorData");

    const oldSaveData = (await collection.findOne({
      displayName: displayName,
    })) as SaveData;
    if (oldSaveData !== null) {
      if (await bcrypt.compare(password, oldSaveData.password))
        await collection.updateOne(
          { displayName: displayName },
          { $set: saveData },
          { upsert: true }
        );
      else return "Access denied!";
    } else {
      saveData.password = await bcrypt.hash(password, saltRounds);
      saveData.displayName = displayName;
      saveData.coins = BigInt(10);
      await collection.insertOne(saveData);
    }

    await client.close();
    return "Success";
  } catch (e) {
    console.error("Error adding Save Data: ", e);
    return "Internal Error occurred when trying to save data";
  }
}

async function getSaveData(
  displayName: string,
  password: string
): Promise<SaveData | null> {
  try {
    const client = new MongoClient(uri);

    const db = client.db("ClickyCursor");
    const collection = db.collection("ClickyCursorData");

    const saveData = (await collection.findOne({
      displayName: displayName,
    })) as SaveData;

    await client.close();

    console.log(await bcrypt.compare(password, saveData.password));
    if (saveData == null) return null;
    else if (await bcrypt.compare(password, saveData.password)) {
      saveData.password = undefined;
      return saveData;
    }
  } catch (e) {
    console.error("Error adding Save Data: ", e);
  }
  return null;
}

async function getLeaderboard(): Promise<SaveData[]> {
  try {
    const client = new MongoClient(uri);

    const db = client.db("ClickyCursor");
    const collection = db.collection("ClickyCursorData");

    const saveData = await collection
      .find({})
      .project({
        _id: 0,
        coins: 1,
        displayName: 1,
        buildingItems: 1,
        cursorItems: 1,
        recipeItems: 1,
      })
      .sort({ coins: -1 })
      .toArray();

    await client.close();
    return saveData;
  } catch (e) {
    console.error("Error adding Save Data: ", e);
  }
  return [];
}

module.exports = {
  userExists,
  login,
  updateSaveData,
  getSaveData,
  getLeaderboard,
};
