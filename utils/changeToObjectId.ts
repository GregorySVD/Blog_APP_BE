import {ObjectId} from "mongodb";

export const changeToObjectId =  (id: string):ObjectId  => {
    return new ObjectId(id);
}
