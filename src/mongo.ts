import { SaveData } from "./model/SaveData";

var MongoClient = require("mongodb").MongoClient;

const uri = `mongodb+srv://${process.env.MONGO_AUTH}@${process.env.MONGO_HOST}`;
const bcrypt = require("bcrypt")
const saltRounds = 10

async function updateSaveData(saveData: SaveData, displayName: string | undefined = undefined, password: string) : Promise<String> {
  try {
    const client = new MongoClient(uri);

    const db = client.db("ClickyCursor");
    const collection = db.collection("ClickyCursorData");

    const oldSaveData = await collection.findOne({ displayName: displayName }) as SaveData;
    if (oldSaveData !== null) {
      if(await bcrypt.compare(password, oldSaveData.password))
        await collection.updateOne({ displayName: displayName }, { $set: saveData }, { upsert: true });
      else return "Access denied!"
    } else {
      saveData.password = await bcrypt.hash(password, saltRounds);
      saveData.displayName = displayName;
      await collection.insertOne(saveData);
    }

    await client.close();
    return "Success";
  } catch (e) {
    console.error("Error adding Save Data: ", e);
    return "Internal Error occurred when trying to save data";
  }
}

async function getSaveData(displayName: string, password: string) : Promise<SaveData | null> {
  try {
    const client = new MongoClient(uri);

    const db = client.db("ClickyCursor");
    const collection = db.collection("ClickyCursorData");

    const saveData = await collection.findOne({ displayName: displayName }) as SaveData;

    await client.close();
    if(await bcrypt.compare(password, saveData.password)){
      saveData.password = undefined;
      return saveData;
    }
  } catch (e) {
    console.error("Error adding Save Data: ", e);
  }
  return null;
}

async function getLeaderboard() : Promise<SaveData[]> {
  try {
    const client = new MongoClient(uri);

    const db = client.db("ClickyCursor");
    const collection = db.collection("ClickyCursorData");

    const saveData = await collection.find({}).toArray();

    await client.close();
    return saveData;
  } catch (e) {
    console.error("Error adding Save Data: ", e);
  }
  return [];
}

module.exports = { updateSaveData, getSaveData, getLeaderboard };