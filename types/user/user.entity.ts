import {ObjectId} from "mongodb";

export interface UserEntity {
    _id?: ObjectId;
    username: string;
    password: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}
