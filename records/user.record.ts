import {UserEntity} from "../types";
import {ObjectId} from "mongodb";
import {usersDB} from "../utils/mongodb";


export class UserRecord implements UserEntity {
    public _id: ObjectId;
    public username: string;
    public password: string;
    public email: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(user: UserEntity) {
        this._id = new ObjectId(user._id);
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

    public static async insert(user): Promise<string> {
        try {
            const {insertedId} = await usersDB.insertOne(user);
            return insertedId
        } catch (err) {
            return await err;
        }
    }
}
