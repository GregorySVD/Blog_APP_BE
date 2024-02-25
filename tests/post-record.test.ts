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
            })
        })
    });
});
