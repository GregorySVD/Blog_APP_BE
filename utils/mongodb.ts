import {MongoClient} from "mongodb";
import {config, MONGO_DB_NAME} from "./config";
import mongoose from "mongoose";
import {UserSchema} from "../types/models/user.schema";


const client = new MongoClient(`${config.mongo.url}${config.server.port}`);

client.connect();


export const UserModel = mongoose.model('users', UserSchema);

export const db = client.db(`${MONGO_DB_NAME}`);

export const postsDB = db.collection("posts");
export const usersDB = db.collection("users");
