import {ObjectId} from "mongodb";

export type UserPublic = {
    _id: ObjectId;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
