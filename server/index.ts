import cors from "cors";
import "express-async-errors";
import express from "express";
import {userRouter} from "../routes/user.route";
import {handleError} from "../utils/errorHandler";
import {homeRoute} from "../routes/home.route";
import {postRoute} from "../routes/post.route";

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
    })
);
app.use(express.json());
app.use("/", homeRoute);
app.use("/post", postRoute);
app.use("/user", userRouter);
app.use(handleError);



app.listen(3001, "0.0.0.0", () => {
    console.log("Listening on http://localhost:3001");
});
