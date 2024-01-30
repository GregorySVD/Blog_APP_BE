import {UserEntity} from "../types";
import {usersDB} from "../utils/mongodb";
import {ObjectId} from "mongodb";
import {emailValidator, passwordValidator, usernameValidator} from "../types/models/user.schema.validation";


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
            usernameValidator(newUser.username);
            passwordValidator(newUser.password);
            emailValidator(newUser.email);

            new UserRecord({
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            if (!newUser._id) newUser._id = new ObjectId();

            const insertResult = await usersDB.insertOne(newUser);
            const insertedId = insertResult.insertedId.toString();
            console.log('User inserted:', insertedId);

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
    // static async isUsernameUnique(username: string): Promise<boolean> {
    //     try {
    //         const existingUser = await usersDB.findOne({"username": username});
    //         return !existingUser;
    //     } catch (err) {
    //         throw new Error(err);
    //     }
    // }
    //
    //
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
