import cors from "cors";
import "express-async-errors";
import express from "express";
import {postsDB} from "../utils/mongodb";

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
    })
);

app.get("/", async (req, res) => {
    try {
        const result = await postsDB.find().toArray();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
});

app.listen(3001, "0.0.0.0", () => {
    console.log("Listening on http://localhost:3001");
});
