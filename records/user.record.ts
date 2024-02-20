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

    async updatePassword(newPassword: string): Promise<boolean> {
        try {
            await passwordValidator(newPassword);
            const hashedNewPassword = await bcrypt.hash(newPassword, SALT);

            const updateResult = await usersDB.updateOne({_id: this._id}, {$set: {password: hashedNewPassword}});
            if (updateResult.matchedCount === 1 && updateResult.modifiedCount === 1) {
                this.password = newPassword;
                return true;
            } else {
                new ValidationError("User not found or password not updated");
            }
            this.updatedAt = new Date();
        } catch (err) {
            throw new ValidationError("Cannot update user password. " + err.message);
        }
    }

    async updateIsAdminStatus(): Promise<void> {
        try {
            const updateResult = await usersDB.updateOne({_id: this._id}, {$set: {isAdmin: !this.isAdmin}});
            if (updateResult.matchedCount === 1 && updateResult.modifiedCount === 1) {
                this.isAdmin = !this.isAdmin;
            } else {
                new ValidationError("User not found or password not updated");
            }
            this.updatedAt = new Date();

        } catch (err) {
            throw new ValidationError("Cannot update user password. Try again later");
        }
    }

    async insertUser(): Promise<string> {
        try {
            // Check if user already exists
            await usernameValidator(this.username);
            await emailValidator(this.email);
            await passwordValidator(this.password);

            //Hashing the password
            this.password = await bcrypt.hash(this.password, SALT);

            const user = await new UserRecord({
                _id: new ObjectId(),
                username: this.username,
                email: this.email,
                password: this.password,
                createdAt: new Date(),
                updatedAt: new Date(),
                isAdmin: false,
            });

            const insertResult = await usersDB.insertOne(user);
            const insertedId = insertResult.insertedId.toString();

            return String(insertedId);

        } catch (err) {
            throw new Error(err);
        }
    }

//-----------------------------------------------------------

    static async ListAllUsers(): Promise<UserEntity[]> {
        try {
            const allUsersCursor = await usersDB.find();
            const allUsersArray = await allUsersCursor.toArray();
            if (!allUsersArray || allUsersArray.length === 0) {
                return [];
            }

            return allUsersArray.map((user) => new UserRecord({
                _id: user._id,
                username: user.username,
                password: user.password,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isAdmin: user.isAdmin,
            }) as UserEntity);

        } catch (err) {
            throw new Error("Can't find users: " + err.message);
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
            });
        } catch (err) {
            throw new ValidationError(`User with id: ${userId} not found`);
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
            throw new ValidationError(`User with username: ${username} not found`);
        }
    }

    //-----------------------------------------------------------

    static async deleteUserById(userId: string): Promise<boolean> {
        try {
            const userObjectId = new ObjectId(userId);
            const result = await usersDB.deleteOne({"_id": userObjectId});
            return result.deletedCount === 1;
        } catch (err) {
            throw new ValidationError(`User with id: ${userId} not found. Please try again later or check if user id is correct.`);
        }
    }

    static async deleteAllUsers(): Promise<void> {
        try {
            const allUsers = await UserRecord.ListAllUsers();
            if (!allUsers || allUsers.length === 0) {
                return;
            } else {
                for (const user of allUsers) {
                    await UserRecord.deleteUserById(String(user._id));
                }
            }
        } catch (err) {
            console.error("Error deleting all users:", err);
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
