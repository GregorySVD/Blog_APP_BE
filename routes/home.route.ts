import {Router, Response, Request} from "express"

export const homeRoute = Router();

homeRoute
    .get("/", async (req: Request, res: Response) => {
    res.redirect("/user")
    })
