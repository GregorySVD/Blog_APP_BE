import {PostEntity} from "../types";

import {PostRecord} from "../records/post.record";
import {validatePostContent, validatePostTitle} from "../utils/post.validation/post.validation";
import {ValidationError} from "../utils/errorHandler";


function createMockPost(): PostEntity {
    const random = Math.floor(Math.random() * 10000) + 1;
    return {
        title: `MockTitle of post ${random}`,
        content: `This is test content of post number ${random}`,
    };
}

async function insertMockPost(): Promise<string> {
    const mockPostData = createMockPost();
    const postRecord = new PostRecord(mockPostData);
    return postRecord.insertOne();
}

describe("PostRecord", () => {
    it("should create a PostRecord object with default values", () => {
        const mockPostData = createMockPost();
        const postRecord = new PostRecord(mockPostData);


        expect(postRecord).toBeInstanceOf(PostRecord);
        expect(postRecord._id).toBeDefined();
        expect(postRecord.content).toBe(mockPostData.content);
        expect(postRecord.title).toBe(mockPostData.title);
        expect(postRecord.imageUrl).toBeDefined();
        expect(postRecord.createdAt).toBeDefined();
        expect(postRecord.updatedAt).toBeDefined();
        expect(postRecord.tags).toBeDefined();
        expect(postRecord.likesCounter).toBeDefined();
        console.log(postRecord);
    });
});
describe("Inserting a new post", () => {
    it("should insert a new post", async () => {
        const mockPost = createMockPost();
        const postRecord = new PostRecord(mockPost);
        const insertedMockId = await postRecord.insertOne();

        expect(typeof insertedMockId).toBe("string");
        await PostRecord.deletePost(insertedMockId);
    });
    it("should throw an error if insertion fails", async () => {
        try {
            const mockPostData = createMockPost();
            mockPostData.content = "short";
            const postRecord = new PostRecord(mockPostData);
            await expect(postRecord.insertOne()).rejects.toThrow("Content has to be more then 9 characters long");
        } catch (err) {

        }

    });
});
describe("Getting a post by ID", () => {
    it("should get a post by ID", async () => {
        const mockPostData = createMockPost();
        const postRecord = new PostRecord(mockPostData);
        const insertedMockId = await postRecord.insertOne();


        const post = await PostRecord.getOne(insertedMockId);

        expect(post).toBeInstanceOf(PostRecord);
        expect(post.title).toEqual(mockPostData.title);
        expect(post.content).toEqual(mockPostData.content);
        await PostRecord.deletePost(insertedMockId);
    });

    it("should return null if post is not found", async () => {
        const post = await PostRecord.getOne("65d8d1493fab60a4fa77a994");
        expect(post).toBeNull();
    });

    it("should throw an error if an exception occurs", async () => {
        await expect(PostRecord.getOne("ghajsf")).rejects.toThrow();
    });
});
describe("Deleting a post by ID", () => {
    it("should delete a post by ID", async () => {
        const mockPostData = createMockPost();
        const postRecord = new PostRecord(mockPostData);
        const insertedMockId = await postRecord.insertOne();
        await PostRecord.deletePost(insertedMockId);
        const deletedPost = await PostRecord.getOne(insertedMockId);
        expect(deletedPost).toBeNull();
    });

    it("should return null if the post to be deleted doesn't exist", async () => {
        const deletedPostId = "65d8d1493fab60a4fa77a994"; // Non-existing ID
        const result = await PostRecord.deletePost(deletedPostId);
        const deletedPost = await PostRecord.getOne(deletedPostId);

        expect(deletedPost).toBeNull();
        expect(result).toBeFalsy();
    });

    describe("getPostsList method", () => {
        it("getPostsList retrieves posts correctly", async () => {
            const posts = await PostRecord.getPostsList();
            expect(posts).toBeInstanceOf(Array);
            expect(posts.length).toBeDefined();

            posts.forEach((post) => {
                expect(post).toBeInstanceOf(PostRecord);
            });
        });
    });
    describe("PostRecord.count_likes can be updated", () => {
        it("should return incremented value of likesCounter", async () => {
            const insertedId = await insertMockPost();
            const postRecord = await PostRecord.getOne(insertedId);
            await postRecord.incrementLikesCount();
            expect(postRecord.likesCounter).toBe(1);
        });
        it("Throws error if likesCounter < 0", async () => {
            const insertedId = await insertMockPost();
            const postRecord = await PostRecord.getOne(insertedId);
            await expect(postRecord.decrementLikesCount()).rejects.toThrow();
        });
        it("should return decrement value of count_likes", async () => {
            const mockPost = createMockPost();
            mockPost.likesCounter = 1;
            const postRecord = new PostRecord(mockPost);
            await postRecord.decrementLikesCount();
            expect(postRecord.likesCounter).toBe(0);
        });

    });

    describe("Validation Functions", () => {
        it("validatePostTitle throws error for empty title", async () => {
            expect(() => validatePostTitle("")).toThrowError(ValidationError);
        });
        it("validatePostTitle throws error for title too short", async () => {
            expect(() => validatePostTitle("short")).toThrowError();
        });
        it("validatePostTitle accepts valid title within limits", async () => {
            expect(() => validatePostTitle("A good title length")).not.toThrowError();
        });
        it("validatePostContent throws error for empty content", async () => {
            expect(() => validatePostContent("")).toThrowError(ValidationError);
        });
        it("validatePostContent throws error for content too short", async () => {
            expect(() => validatePostContent("short")).toThrowError(ValidationError);
        });
        it("validatePostContent accepts valid content within limits", async () => {
            expect(() => validatePostContent("This is a good length of content for a post")).not.toThrowError();
        });
    });

    describe("updateTitle method", () => {
        it("updates the title and returns true", async () => {
            const mockPost = createMockPost();
            const postRecord = new PostRecord(mockPost);
            const insertedMockId = await postRecord.insertOne();

            const newTitle = "New and Improved Title";
            await expect(postRecord.updateTitle(newTitle)).resolves.toBe(true);

            const updatedPost = await PostRecord.getOne(insertedMockId);
            expect(updatedPost.title).toBe(newTitle);

            await PostRecord.deletePost(insertedMockId);
        });

        it("throws an error if validation fails", async () => {
            const mockPost = createMockPost();
            const postRecord = new PostRecord(mockPost);
            const insertedMockId = await postRecord.insertOne();

            const invalidTitle = "";
            await expect(postRecord.updateTitle(invalidTitle)).rejects.toThrowError(
                "Error updating title: Title has to be between 8 and 255 characters long."
            );

            const updatedPost = await PostRecord.getOne(insertedMockId);
            expect(updatedPost.title).not.toBe(invalidTitle);

            await PostRecord.deletePost(insertedMockId);
        });
    });
    describe("updateContent method", () => {
        it("updates the content and returns true", async () => {
            const mockPost = createMockPost();
            const postRecord = new PostRecord(mockPost);
            const insertedMockId = await postRecord.insertOne();

            const newContent = "This is the updated content.";
            await expect(postRecord.updateContent(newContent)).resolves.toBe(true);

            const updatedPost = await PostRecord.getOne(insertedMockId);
            expect(updatedPost.content).toBe(newContent);

            await PostRecord.deletePost(insertedMockId);
        });

        it("throws an error if validation fails", async () => {
            const mockPost = createMockPost();
            const postRecord = new PostRecord(mockPost);
            const insertedMockId = await postRecord.insertOne();

            const invalidContent = "";
            await expect(postRecord.updateContent(invalidContent)).rejects.toThrowError(
                "Error updating content: Content has to be between 10 and 2200 characters long."
            );

            const updatedPost = await PostRecord.getOne(insertedMockId);
            expect(updatedPost.content).not.toBe(invalidContent);
            await PostRecord.deletePost(insertedMockId);
        });
    });

    describe("updateImage method", () => {
        it("updates the image and returns true", async () => {
            const mockPost = createMockPost();
            const postRecord = new PostRecord(mockPost);
            const insertedMockId = await postRecord.insertOne();

            const insertedPost = await PostRecord.getOne(insertedMockId);
            const newImageUrl = "https://example.com/new-image.jpg";
            await insertedPost.updateImage(newImageUrl);
            await console.log(insertedPost.imageUrl);
            await expect(insertedPost.imageUrl).toBe(newImageUrl);
            await PostRecord.deletePost(insertedMockId);
        });

        it("throws an error if the image URL is empty", async () => {
            const mockPost = createMockPost();
            const postRecord = new PostRecord(mockPost);

            const invalidImageUrl = "";
            await expect(postRecord.updateImage(invalidImageUrl)).rejects.toThrowError(
                "Wrong image URL."
            );
        });
    });
});
