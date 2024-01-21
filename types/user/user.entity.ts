import {ObjectId} from "mongodb";



export interface UserEntity {
    _id?: ObjectId;
    username: string;
    password: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// export interface UserEntityDocument extends UserEntity, Document {}
// export interface UserEntityModel extends Model<UserEntityDocument> {}
