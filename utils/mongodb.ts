import {MongoClient} from "mongodb";


const client = new MongoClient('mongodb://127.0.0.1:27017');

client.connect();

export const db = client.db("blogDB");

export const posts = db.collection("posts");
