import cors from "cors";
import "express-async-errors";
import express from "express";
import {userRouter} from "../routes/user.route";
import {handleError} from "../utils/errorHandler";
import {homeRoute} from "../routes/home.route";
import {PostRecord} from "../records/post.record";

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
    })
);
app.use(express.json());
app.use("/", homeRoute);
app.use("/user", userRouter);
app.use(handleError);

app.get("/post", async (req, res) => {
    const post = await PostRecord.getPostsList();
    res.json(post);
})

app.listen(3001, "0.0.0.0", () => {
    console.log("Listening on http://localhost:3001");
});
