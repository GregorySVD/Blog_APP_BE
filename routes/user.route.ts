import {Router} from "express"
import {ValidationError} from "../utils/errorHandler";
import {UserRecord} from "../records/user.record";


export const userRouter = Router();

userRouter
    .get("/", async (req, res) => {
        try {
            const result = await UserRecord.ListAllUsers();
            res.json(result);
        } catch (err) {
            throw new ValidationError("List of users cannot be found, please try again later.");
        }
    })
    .delete("/", async (req, res) => {
        try {
            await UserRecord.deleteAllUsers();
            res.json({message: "users deleted successfully!"});
        } catch (err) {
            throw new ValidationError("List of users cannot be found, please try again later.");
        }
    })
    ///@TODO: create Post routers

    .get("/:id", async (req, res) => {
        try {
            const result = await UserRecord.getUserById(req.params.id);
            if (!result) {
                res.status(404).json({error: `User with id ${req.params.id} does not exist`});
            } else {
                res.json(result);
            }
        } catch (err) {
            throw new ValidationError(`User with ${req.params.id} does not exist `);
        }
    })
    .get("/:username", async (req, res) => {
        try {
            const result = await UserRecord.getUserByUsername(req.params.username);
            if (!result) {
                res.status(404).json({error: `User with username ${req.params.username} does not exist`});
            } else {
                res.json(result);
            }
        } catch (err) {
            throw new ValidationError(`User with ${req.params.username} does not exist `);
        }
    })
    .delete("/:id", async (req, res) => {
        try {
            const result = await UserRecord.deleteUserById(req.params.id);
            if (!result) {
                res.status(404).json({error: `User with id ${req.params.id} does not exist`});
            } else {
                res.json({message: `User with id ${req.params.id} deleted successfully!`});
            }
        } catch (err) {
            throw new ValidationError(`User with ${req.params.id} does not exist `);
        }
    })
