import {PostEntity} from "../types";

import {PostRecord} from "../records/post.record";


function createMockPost(): PostEntity {
    const random = Math.floor(Math.random() * 10000) + 1;
    return {
        title: "MockTitle of post" + random,
        content: "This is test content of post number" + random,
    };
}
//@TODO: use eslint
describe('PostRecord', () => {
    it('should create a PostRecord object with default values', () => {
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
    });
});
