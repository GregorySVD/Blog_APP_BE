import {ObjectId} from "mongodb";
import {Tags} from "../enums";

export interface PostEntity {
    _id?: ObjectId;
    title: string,
    content: string,
    image?: string,
    createdAt?: Date;
    updatedAt?: Date;
    tags?: Tags[];
    likesCounter?: number;
}
