import {Router} from "express"
import {ValidationError} from "../utils/errorHandler";
import {UserRecord} from "../records/user.record";


export const userRouter = Router();

userRouter
    // POST route to create a new user
    .post("/", async (req, res) => {
        try {
            const newUsers = new UserRecord(req.body);
            const insertedUserId = await newUsers.insertUser();
            res.json({message: `User with id: ${insertedUserId} inserted successfully!`});
        } catch (err) {
            throw new ValidationError("Could not insert user into database, please try again later.");
        }
    })

    // GET route to retrieve all users
    .get("/", async (req, res) => {
        try {
            const result = await UserRecord.ListAllUsers();
            res.json(result);
        } catch (err) {
            throw new ValidationError(err.message);
        }
    })

    // GET route to retrieve user by ID
    .get("/id/:id", async (req, res) => {
        try {
            const result = await UserRecord.getUserById(req.params.id);
            if (!result) {
                res.status(404).json({error: `User with id ${req.params.id} does not exist`});
            } else {
                res.json(result);
            }
        } catch (err) {
            throw new ValidationError(err.message);
        }
    })

    // GET route to retrieve user by username
    .get("/username/:username", async (req, res) => {
        try {
            const result = await UserRecord.getUserByUsername(req.params.username);
            if (!result) {
                res.status(404).json({error: `User with username ${req.params.username} does not exist`});
            } else {
                res.json(result);
            }
        } catch (err) {
            throw new ValidationError(err.message);
        }
    })

    // DELETE route to delete user by ID
    .delete("/:id", async (req, res) => {
        try {
            const result = await UserRecord.deleteUserById(req.params.id);
            if (!result) {
                res.status(404).json({error: `User with id ${req.params.id} does not exist`});
            } else {
                res.json({message: `User with id ${req.params.id} deleted successfully!`});
            }
        } catch (err) {
            throw new ValidationError(err.message);
        }
    })

    // DELETE route to delete all users
    .delete("/", async (req, res) => {
        try {
            await UserRecord.deleteAllUsers();
            res.json({message: "Users deleted successfully!"});
        } catch (err) {
            throw new ValidationError("List of users cannot be found, please try again later.");
        }
    })

    // PUT route to update user password by ID
    .put("/password/:id", async (req, res) => {
        try {
            const user = await UserRecord.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }
            const userRecord = await new UserRecord(user);
            await userRecord.updatePassword(req.body.password);
            await res.json({message: "Password updated!"});
        } catch (err) {
            console.error(err);
            throw new ValidationError(err.message);
        }
    })
    // PATCH route to update user isAdmin status
    .patch("/admin/:id", async (req, res) => {
        try {
            const user = await UserRecord.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }
            const userRecord = await new UserRecord(user);
            const result = await userRecord.updateIsAdminStatus();
            if(result) {
                await res.status(200).json({message: 'User updated successfully!',
                isAdmin: !user.isAdmin});
            }
        } catch (err) {
            throw new ValidationError(err.message);
        }
    })
