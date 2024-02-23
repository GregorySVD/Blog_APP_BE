import {PostEntity, Tags} from "../types";
import {ObjectId} from "mongodb";
import {postsDB} from "../utils/mongodb";
import {ValidationError} from "../utils/errorHandler";
import {changeToObjectId} from "../utils/changeToObjectId";

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
        if (!obj.title || obj.title.length < 3 || obj.title.length > 150) {
            throw new ValidationError("Title has to be between 3 and 150 characters long");
        }
        if (!obj.content || obj.content.length < 10) {
            throw new ValidationError("Content has to be more then 9 characters long");
        }

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
            this.tags = [Tags.Newsy];
        }
        if (!obj.image) {
            this.image = "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png"
        }
//@TODO: use eslint and create CRUDE methods like: insert new post, find all posts...
    }

    async insertOne(): Promise<string> {
        try {
            const post = await new PostRecord({
                _id: this._id,
                content: this.content,
                title: this.title,
                updatedAt: this.updatedAt,
                image: this.image,
                tags: this.tags,
                createdAt: this.createdAt,
                count_likes: this.count_likes,
            });
            await postsDB.insertOne(post);
            return this._id.toString();
        } catch (err) {
            throw new ValidationError("Cannot insert task. Try again later" + err.message);
        }
    }

    static async getOne(postId: string): Promise<PostRecord | null> {
        try {
            const foundedPost = await postsDB.findOne({"_id": changeToObjectId(postId)});
            if (!foundedPost) return null;

            return new PostRecord({
                _id: foundedPost._id,
                count_likes: foundedPost.count_likes,
                title: foundedPost.title,
                content: foundedPost.content,
                tags: foundedPost.tags,
                image: foundedPost.image,
                createdAt: foundedPost.createdAt,
                updatedAt: foundedPost.updatedAt,
            });

        } catch (err) {
            if (err.message.includes('Post with id')) {
                return null;
            }
            throw new ValidationError(`An error occurred while fetching the post: ${err.message}`);
        }
    }
}
