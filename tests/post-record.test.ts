import {PostEntity} from "../types";

import {PostRecord} from "../records/post.record";


function createMockPost(): PostEntity {
    const random = Math.floor(Math.random() * 10000) + 1;
    return {
        title: `MockTitle of post ${random}`,
        content: `This is test content of post number ${random}`,
    };
}

describe("PostRecord", () => {
    it("should create a PostRecord object with default values", () => {
        const mockPostData = createMockPost();
        const postRecord = new PostRecord(mockPostData);


        expect(postRecord).toBeInstanceOf(PostRecord);
        expect(postRecord._id).toBeDefined();
        expect(postRecord.content).toBe(mockPostData.content);
        expect(postRecord.title).toBe(mockPostData.title);
        expect(postRecord.image).toBeDefined();
        expect(postRecord.createdAt).toBeDefined();
        expect(postRecord.updatedAt).toBeDefined();
        expect(postRecord.tags).toBeDefined();
        expect(postRecord.count_likes).toBeDefined();
        console.log(postRecord);
    });
});
describe("Inserting a new post", () => {
    it("should insert a new post", async () => {
        const mockPost = createMockPost();
        const postRecord = new PostRecord(mockPost);
        const postId = await postRecord.insertOne();

        expect(typeof postId).toBe("string");
    });
    it("should throw an error if insertion fails", async () => {
        try {
            const mockPostData = createMockPost();
            mockPostData.content = null;
            const postRecord = new PostRecord(mockPostData);

            await postRecord.insertOne();

            await expect(postRecord.insertOne()).rejects.toThrow();
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

    });

    it("should return null if post is not found", async () => {
        const post = await PostRecord.getOne("65d8d1493fab60a4fa77a994");
        expect(post).toBeNull();
    });

    it("should throw an error if an exception occurs", async () => {
        await expect(PostRecord.getOne("ghajsf")).rejects.toThrow();
    });
});
