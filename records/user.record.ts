import {ObjectId} from "mongodb";
import {UserEntity, UserPublic} from "../types";
import {UserModel, usersDB} from "../utils/mongodb";
import {emailValidator, passwordValidator, usernameValidator} from "../types/models/user.schema";

export class UserRecord implements UserEntity {
    public _id: ObjectId;
    public username: string;
    public password: string;
    public email: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(user: UserEntity) {
        this._id = user._id ? new ObjectId(user._id) : new ObjectId();
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

    // @TODO create metod to find user by ID and username
    async insert(): Promise<string> {

            // @TODO check if username and email are unique
            const userModel = new UserModel({
                _id: this._id,
                username: this.username,
                password: this.password,
                email: this.email,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
            });
            if (!passwordValidator(this.password) || !emailValidator(this.email) || !usernameValidator(this.username))
               throw new Error("Invalid data");

            await usersDB.insertOne(userModel);
            return userModel._id.toString();

    }

    static async getUserByUsername(username: string): Promise<UserPublic | null> {
        const userModel = await usersDB.findOne({username});
        if (!userModel) return null;

        return {
            username: userModel.username,
            email: userModel.email,
            createdAt: userModel.createdAt,
            updatedAt: userModel.updatedAt,
            _id: userModel._id,
        };

    }
}
