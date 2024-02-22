import {PostEntity, Tags} from "../types";
import {ObjectId} from "mongodb";

export class PostRecord implements PostEntity {
    _id: ObjectId;
    content: string;
    title: string;
    image: string;
    createdAt?: Date;
    updatedAt?: Date;
    tags?: Tags[];
    count_likes?: number;


    constructor(obj: PostEntity) {
        this._id = obj._id ? new ObjectId(obj._id) : new ObjectId();
        this.content = obj.content;
        this.title = obj.title;
        this.image = obj.image;
        this.tags = obj.tags;
        this.count_likes = obj.count_likes;
        this.createdAt = new Date();
        this.updatedAt = new Date();

        if (!obj.count_likes) {
            this.count_likes = 0
        }
        if (!obj.tags) {
            this.tags = [];
        }
        if (!obj.image) {
            this.image = "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png"
        }

    }
}
