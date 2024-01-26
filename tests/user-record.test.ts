import {ObjectId} from "mongodb";
import {UserRecord} from "../records/user.record";
import {UserEntity, UserPublic} from "../types";


function createMockUser(): UserEntity {
    const random = Math.floor(Math.random() * 10000) + 1;
    const mockUserData: UserEntity = {
        _id: new ObjectId(),
        username: `MockUser${random}`,
        password: "TestPassword!132",
        email: `mockEmail${random}@example.com`,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return new UserRecord(mockUserData);

}


test("Can build new UserRecord", async () => {
    const userRecordTest = createMockUser();

    expect(userRecordTest.username).toBe(userRecordTest.username);
    expect(userRecordTest._id).toBeInstanceOf(ObjectId);
    expect(userRecordTest.password).toBe(userRecordTest.password);
    expect(userRecordTest.email).toBe(userRecordTest.email);
    expect(userRecordTest.createdAt).toBe(userRecordTest.createdAt);
    expect(userRecordTest.updatedAt).toBe(userRecordTest.updatedAt);

});

test("Can insert new user", async () => {
    const mockUser = createMockUser();
    const userRecordTest = new UserRecord(mockUser);
    await userRecordTest.insert();
    await expect(userRecordTest._id).toBeDefined();

});
test("Wrong password throws error", async () => {
    const wrongPasswordMockUser = createMockUser();
    wrongPasswordMockUser.password = "wrong";
    const userRecord = new UserRecord(wrongPasswordMockUser);
    const insertUser = async () => userRecord.insert();
    await expect(insertUser).rejects.toThrowError("Invalid password");
});
test("Wrong username throws error", async () => {
    const wrongUsernameMockUser = createMockUser();
    wrongUsernameMockUser.username = "er";
    const userRecord = new UserRecord(wrongUsernameMockUser);
    const insertUser = async () => userRecord.insert();
    await expect(insertUser).rejects.toThrowError("Invalid username");
});
test("Invalid email throws an error", async () => {
    const wrongEmailMockUser = createMockUser();
    wrongEmailMockUser.email = "wrongemail";
    const userRecord = new UserRecord(wrongEmailMockUser);
    const insertUser = async () => userRecord.insert();

    await expect(insertUser).rejects.toThrowError("Invalid email");
});
test("Can find single user record by username", async () => {
    const mockUser = createMockUser();
    const testUser = new UserRecord(mockUser)
    await testUser.insert();
    const foundedUser = await UserRecord.getUserByUsername(`${testUser.username}`);
    await expect(foundedUser).toEqual(expect.objectContaining<UserPublic>(foundedUser));
});
test("Not founded user record by username returns null", async () => {
    const foundedUser = await UserRecord.getUserByUsername("nullish");
    await expect(foundedUser).toBeNull();
});
test("Can find single user record by email", async () => {
    const mockUser = createMockUser();
    const testUser = new UserRecord(mockUser)
    await testUser.insert();
    const foundedUser = await UserRecord.getUserByEmail(`${testUser.email}`);
    await expect(foundedUser).toEqual(expect.objectContaining<UserPublic>(foundedUser));
});
test("Not founded user record by email returns null", async () => {
    const foundedUser = await UserRecord.getUserByEmail("nullish");
    await expect(foundedUser).toBeNull();
});
test("Can find single user record by _id", async () => {
    const mockUser = createMockUser();
    const testUser = new UserRecord(mockUser)
    await testUser.insert();
    const foundedUser = await UserRecord.getUserById(`${testUser._id}`);
    await expect(foundedUser).toEqual(expect.objectContaining<UserPublic>(foundedUser));
});
test("Not founded user record by _id returns null", async () => {
    const foundedUser = await UserRecord.getUserById("65b15b6973947f0159b8ad22");
    await expect(foundedUser).toBeNull();
});
test("Cannot insert user with taken username", async () => {
    const mockUser = createMockUser();
    const testUser = new UserRecord(mockUser)
    await testUser.insert();
    try {
        await testUser.insert();
    } catch (error) {
        expect(error.message).toBe("This username is already taken! Try another one.");
    }
});
