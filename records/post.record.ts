import {ObjectId} from "mongodb";
import {PostEntity, Tags} from "../types";
import {postsDB} from "../utils/mongodb";
import {ValidationError} from "../utils/errorHandler";
import {changeToObjectId} from "../utils/changeToObjectId";
import {validatePostContent, validatePostTitle} from "../utils/post.validation/post.validation";

export class PostRecord implements PostEntity {
    _id: ObjectId;
    content: string;
    title: string;
    imageUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
    tags?: Tags[];
    likesCounter?: number;

    constructor(obj: PostEntity) {
        validatePostTitle(obj.title);
        validatePostContent(obj.content);
        if (obj.likesCounter < 0) {
            throw new ValidationError("Likes must be positive number!");
        }

        this._id = obj._id ? new ObjectId(obj._id) : new ObjectId();
        this.content = obj.content;
        this.title = obj.title;
        this.imageUrl = obj.imageUrl;
        this.tags = obj.tags;
        this.likesCounter = obj.likesCounter;
        this.createdAt = obj.createdAt ? new Date(obj.createdAt) : new Date();
        this.updatedAt = obj.updatedAt ? new Date(obj.updatedAt) : new Date();

        if (!obj.createdAt) {
            this.createdAt = new Date();
        }
        if (!obj.updatedAt) {
            this.updatedAt = new Date();
        }
        if (!obj.likesCounter) {
            this.likesCounter = 0;
        }
        if (!obj.tags) {
            this.tags = [Tags.Newsy];
        }
        if (!obj.imageUrl) {
            this.imageUrl = "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png";
        }
    }

    async updateTitle(title: string): Promise<boolean> {
        try {
            validatePostTitle(title);
            this.title = title;
            await postsDB.updateOne({_id: this._id}, {$set: {title}});
            this.updatedAt = new Date();
            return true;
        } catch (err) {
            throw new ValidationError(`Error updating title: ${err.message}`);
        }
    }

    async updateContent(content: string) {
        try {
            validatePostContent(content);
            this.title = content;
            await postsDB.updateOne({_id: this._id}, {$set: {content}});
            this.updatedAt = new Date();
            return true;
        } catch (err) {
            throw new ValidationError(`Error updating content: ${err.message}`);
        }
    }

    async updateImage(imageUrl: string) {
        if (!imageUrl) {
            throw new ValidationError(`Wrong image URL.`);
        }
        const imageUrlRegex = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*\.(jpg|jpeg|png|gif|bmp)$/;

        if (!imageUrlRegex.test(imageUrl)) {
            throw new ValidationError(`Invalid image URL format.`);
        }

        try {
            this.imageUrl = imageUrl;
            await postsDB.updateOne({_id: this._id}, {$set: {imageUrl}});
            this.updatedAt = new Date();
            return true;
        } catch (err) {
            throw new ValidationError(`Error updating image: ${err.message}.`);
        }
    }

    //@TODO: Create method to update Tags.

    async insertOne(): Promise<string> {
        try {
            const post = await new PostRecord({
                _id: this._id,
                content: this.content,
                title: this.title,
                updatedAt: this.updatedAt,
                imageUrl: this.imageUrl,
                tags: this.tags,
                createdAt: this.createdAt,
                likesCounter: this.likesCounter,
            });
            await postsDB.insertOne(post);
            return this._id.toString();
        } catch (err) {
            throw new ValidationError(`Cannot insert task. Try again later. ${err.message}`);
        }
    }

    //@TODO: Fix incrementLikesCount method, it only increment local value. Value in database stays the same.
    async incrementLikesCount(): Promise<number> {
        try {
            this.likesCounter++;
            await postsDB.updateOne({_id: this._id}, {$inc: {likesCounter: 1}});
            return this.likesCounter;
        } catch (err) {
            throw new ValidationError(`Cannot increment likes count. ${err.message}`);
        }
    }

    //@TODO: Fix decrementLikesCount method, it only increment local value. Value in database stays the same.
    async decrementLikesCount(): Promise<number> {
        try {
            if (this.likesCounter < 0) {
                new ValidationError("Likes should be positive number!");
            }
            await postsDB.updateOne({_id: this._id}, {$set: {likesCounter: this.likesCounter}});
            return this.likesCounter;
        } catch (err) {
            throw new ValidationError(`Cannot decrement likes count. ${err.message}`);
        }
    }

    static async deletePost(postId: string): Promise<boolean> {
        try {
            const result = await postsDB.deleteOne({"_id": changeToObjectId(postId)});
            return result.deletedCount === 1;
        } catch (err) {
            throw new ValidationError(`Cannot delete this post. Try again later. ${err.message}`);
        }
    }

    static async getOne(postId: string): Promise<PostRecord | null> {
        try {
            const foundedPost = await postsDB.findOne({"_id": changeToObjectId(postId)});
            if (!foundedPost) return null;

            return new PostRecord({
                _id: foundedPost._id,
                likesCounter: foundedPost.count_likes,
                title: foundedPost.title,
                content: foundedPost.content,
                tags: foundedPost.tags,
                imageUrl: foundedPost.image,
                createdAt: foundedPost.createdAt,
                updatedAt: foundedPost.updatedAt,
            });

        } catch (err) {
            if (err.message.includes("Post with id")) {
                return null;
            }
            throw new ValidationError(`An error occurred while fetching the post: ${err.message}`);
        }

    }

    static async getPostsList(): Promise<PostEntity[] | []> {
        const postsArray = await postsDB.find().toArray();

        if (!postsArray || postsArray.length === 0) {
            return [];
        }

        return postsArray.map((post) => new PostRecord({
            _id: post._id,
            content: post.content,
            title: post.title,
            updatedAt: post.updatedAt,
            imageUrl: post.image,
            tags: post.tags,
            createdAt: post.createdAt,
            likesCounter: post.count_likes,
        }) as PostRecord);
    }
}
