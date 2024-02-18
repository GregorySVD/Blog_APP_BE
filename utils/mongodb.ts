import {MongoClient} from "mongodb";
import {config, MONGO_DB_NAME} from "./config";




const client = new MongoClient(`${config.mongo.url}${config.server.port}/`)
console.log("Connected to MongoDB!");
client.connect();
const db = client.db(MONGO_DB_NAME);

export const usersDB = db.collection("Users");
export const postsDB = db.collection("Posts");
