import {MongoClient} from "mongodb";
import {config, MONGO_DB_NAME} from "./config";


const client = new MongoClient(`${config.mongo.url}${config.server.port}`);

client.connect();

export const db = client.db(`${MONGO_DB_NAME}`);

export const postsDB = db.collection("posts");
export const usersDB = db.collection("users");
