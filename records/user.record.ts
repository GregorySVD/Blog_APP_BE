import {ObjectId} from "mongodb";
import * as bcrypt from "bcryptjs";
import {UserEntity} from "../types";
import {usersDB} from "../utils/mongodb";
import {emailValidator, passwordValidator, usernameValidator} from "../utils/user.validation/user.validation";
import {SALT} from "../utils/crypto";
import {ValidationError} from "../utils/errorHandler";


export class UserRecord implements UserEntity {
    _id: ObjectId;
    username: string;
    password: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    isAdmin: boolean;

    constructor(user: UserEntity) {
        this._id = user._id ? new ObjectId(user._id) : new ObjectId();
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.isAdmin = user.isAdmin;
    }

//-----------------------------------------------------------

    async updatePassword(newPassword: string): Promise<void> {
        try {
            await passwordValidator(newPassword);
            const hashedNewPassword = await bcrypt.hash(newPassword, SALT);

            const updateResult = await usersDB.updateOne({_id: this._id}, {$set: {password: hashedNewPassword}});
            if (updateResult.matchedCount === 1 && updateResult.modifiedCount === 1) {
                console.log("User password updated successfully");
                this.password = newPassword;
            } else {
                new ValidationError("User not found or password not updated");
            }
            this.updatedAt = new Date();
        } catch (err) {
            throw new ValidationError("Cannot update user password.");
        }
    }

    async updateIsAdminStatus(): Promise<void> {
        try {
            const updateResult = await usersDB.updateOne({_id: this._id}, {$set: {isAdmin: !this.isAdmin}});
            if (updateResult.matchedCount === 1 && updateResult.modifiedCount === 1) {
                console.log("User password updated successfully");
                this.isAdmin = !this.isAdmin;
            } else {
                new ValidationError("User not found or password not updated");
            }
            this.updatedAt = new Date();

        } catch (err) {
            throw new ValidationError("Cannot update user password. Try again later");
        }
    }

    static async insertUser(newUser: UserEntity): Promise<string> {
        try {
            // Check if user already exists
            await usernameValidator(newUser.username);
            await emailValidator(newUser.email);
            await passwordValidator(newUser.password);

            //Hashing the password
            newUser.password = await bcrypt.hash(newUser.password, SALT);

            await new UserRecord({
                _id: new ObjectId(),
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                createdAt: new Date(),
                updatedAt: new Date(),
                isAdmin: false,
            });

            const insertResult = await usersDB.insertOne(newUser);
            const insertedId = insertResult.insertedId.toString();
            console.log("User inserted:", insertedId);

            return String(insertedId);

        } catch (err) {
            throw new Error(err);
        }
    }

//-----------------------------------------------------------

    static async ListAllUsers(): Promise<UserEntity[]> {
        try {
            const allUsers = await usersDB.find().toArray();
            return allUsers.map((user) => new UserRecord({
                _id: user._id,
                username: user.username,
                password: user.password,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isAdmin: user.isAdmin,
            }));
        } catch (err) {
            throw new Error("Can't find users");
        }
    }

    //-----------------------------------------------------------

    static async getUserById(userId: string): Promise<UserEntity | null> {
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
                isAdmin: foundedUser.isAdmin,
            } as UserRecord);

        } catch (err) {
            throw new ValidationError("An unexpected error occurred. Please try again later.");
        }
    }

//-----------------------------------------------------------

    static async getUserByUsername(username: string): Promise<UserEntity | null> {
        try {
            const foundedUser = await usersDB.findOne({"username": username});
            if (!foundedUser) return null;

            return new UserRecord({
                _id: foundedUser._id,
                username: foundedUser.username,
                password: foundedUser.password,
                email: foundedUser.email,
                createdAt: foundedUser.createdAt,
                updatedAt: foundedUser.updatedAt,
                isAdmin: foundedUser.isAdmin,
            } as UserRecord);

        } catch (err) {
            throw new ValidationError("An unexpected error occurred. Please try again later.");
        }
    }

    //-----------------------------------------------------------

    static async deleteUserById(userId: string): Promise<boolean> {
        try {
            const userObjectId = new ObjectId(userId);
            const result = await usersDB.deleteOne({"_id": userObjectId});

            if (result.deletedCount === 1) {
                console.log(`User with ID ${userId} deleted successfully`);
                return true;
            }
            return false;
        } catch (err) {
            throw new ValidationError("An unexpected error occurred. Please try again later.");
        }
    }

    static async deleteAllUsers(): Promise<void> {
        try {
            const allUsers = await UserRecord.ListAllUsers();
            if (allUsers.length === 0) {
                return;
            }
            for (const user of allUsers) {
                await UserRecord.deleteUserById(String(user._id));
            }
            await console.log("Users deleted successfully!");
        } catch (err) {
            throw new ValidationError("An unexpected error occurred. Please try again later.");
        }
    }

    static async login(username: string, password: string): Promise<UserEntity | null> {
        try {
            const user = await UserRecord.getUserByUsername(username);
            if (!user) {
                return null;
            }
            const isMatched = await bcrypt.compare(password, user.password);
            if (isMatched) {
                return user;
            }
            return null;
        } catch (err) {
            throw new ValidationError("An unexpected error occurred. Please try again later.");
        }
    }

}
