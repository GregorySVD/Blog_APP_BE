import {ObjectId} from "mongodb";
import {UserEntity} from "../types";
import {usersDB} from "../utils/mongodb";
import {emailValidator, passwordValidator, usernameValidator} from "../utils/user.validation/user.validation";


export class UserRecord implements UserEntity {
    _id: ObjectId;
    username: string;
    password: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: UserEntity) {
        this._id = user._id ? new ObjectId(user._id) : new ObjectId();
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

//-----------------------------------------------------------
    static async insertUser(newUser: UserEntity): Promise<string> {
        try {
            // Check if user already exists
            await usernameValidator(newUser.username);
            await emailValidator(newUser.email);
            await passwordValidator(newUser.password);

            new UserRecord({
                _id: new ObjectId(),
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                createdAt: new Date(),
                updatedAt: new Date()
            });


            const insertResult = await usersDB.insertOne(newUser);
            const insertedId = insertResult.insertedId.toString();
            console.log("User inserted:", insertedId);

            return String(insertedId);

        } catch (err) {
            throw new Error(err);
        }
    }

    static async findUserById(userId: string): Promise<UserEntity | null> {
        try {
            const userObjectId = new ObjectId(userId);
            const foundedUser = await usersDB.findOne({"_id": userObjectId});
            if (!foundedUser) return null;

            return new UserRecord({
                _id: foundedUser._id,
                username: foundedUser.username,
                password: foundedUser.password,
                email: foundedUser.email,
                createdAt: foundedUser.createdAt,
                updatedAt: foundedUser.updatedAt,
            });
        } catch (err) {
            throw new Error(err);
        }
    }

    //

    //----------------------------------------------------------------

    // static async deleteUserById(userId: string): Promise<boolean> {
    //     try {
    //
    //         const userObjectId = new ObjectId(userId);
    //         const result = await usersDB.deleteOne({"_id": userObjectId});
    //
    //         if (result.deletedCount === 1) {
    //             console.log(`User with ID ${userId} deleted successfully`);
    //             return true;
    //         } else {
    //             console.log(`User with ID ${userId} not found`);
    //             return false;
    //         }
    //     } catch (err) {
    //         throw new Error(err);
    //     }
    // }

}
