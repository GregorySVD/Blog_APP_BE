import {ObjectId} from "mongodb";
import {UserEntity} from "../types";
import {UserRecord} from "../records/user.record";
import {isUsernameUnique} from "../utils/user.validation/user.validation";




function createMockUser(): UserEntity {
    const random = Math.floor(Math.random() * 10000) + 1;
    const mockUserData: UserEntity = {
        username: `MockUser${random}`,
        password: "TestPassword!132",
        email: `mockEmail${random}@example.com`,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return new UserRecord(mockUserData);

}

export async function insertMockUser(): Promise<string> {
    const mockUser = createMockUser();
    return UserRecord.insertUser(mockUser);
}

//----------------------------------------------------------------
test("Can build new UserRecord", async () => {
    const userRecordTest = createMockUser();
    expect(userRecordTest.username).toBe(userRecordTest.username);
    expect(userRecordTest.password).toBe(userRecordTest.password);
    expect(userRecordTest.email).toBe(userRecordTest.email);
    expect(userRecordTest.createdAt).toBe(userRecordTest.createdAt);
    expect(userRecordTest.updatedAt).toBe(userRecordTest.updatedAt);
});
//----------------------------------------------------------------
test("Can insert new user", async () => {
    const insertedUserId = await insertMockUser();
    await expect(insertedUserId).toBeDefined();
});
//----------------------------------------------------------------
test("Wrong password throws error", async () => {
    const wrongPasswordMockUser = createMockUser();
    wrongPasswordMockUser.password = "wrong";
    const userRecord = new UserRecord(wrongPasswordMockUser);
    const insertUser = async () => UserRecord.insertUser(userRecord);
    await expect(insertUser).rejects.toThrowError();
});
//----------------------------------------------------------------
test("Invalid username throws an error", async () => {
    const wrongUsernameMockUser = createMockUser();
    wrongUsernameMockUser.username = "er";
    const userRecord = new UserRecord(wrongUsernameMockUser);
    const insertUser = async () => UserRecord.insertUser(userRecord);
    await expect(insertUser).rejects.toThrowError();
});
//----------------------------------------------------------------
test("Invalid email throws an error", async () => {
    const wrongEmailMockUser = createMockUser();
    wrongEmailMockUser.email = "wrongemail";
    const userRecord = new UserRecord(wrongEmailMockUser);
    const insertUser = async () => UserRecord.insertUser(userRecord);

    await expect(insertUser).rejects.toThrowError();
});
//----------------------------------------------------------------
test("Can find single user record by _id", async () => {
    const mockUser = createMockUser();
    const insertedUserId = await UserRecord.insertUser(mockUser);
    const user = await UserRecord.findUserById(insertedUserId);
    await expect(user).toEqual(expect.objectContaining<UserEntity | null>(user));
});
//----------------------------------------------------------------
test("Not founded user returns null", async () => {
    const foundedUser = await UserRecord.findUserById("65b15b6973947f0159b8ad22");
    await expect(foundedUser).toBeNull();
});
//----------------------------------------------------------------
test("isUsernameUnique returns false if this username is already taken", async () => {
    const insertedMockUser = await insertMockUser();
    const insertedUser = await UserRecord.findUserById(insertedMockUser);
    const result = await isUsernameUnique(insertedUser.username);
    expect(result).toBeFalsy();
});
//----------------------------------------------------------------
test("isUsernameUnique returns true if this username is unique", async () => {
    const result = await isUsernameUnique("TestUniqueUser");
    expect(result).toBeTruthy();
});
//----------------------------------------------------------------
test("Cannot insert user with taken username", async () => {
    const mockUser = createMockUser();
    await UserRecord.insertUser(mockUser);
    try {
        await UserRecord.insertUser(mockUser);
    } catch (error) {
        expect(error.message).toBe("Error: Invalid username: This username is already taken");
    }
});
//----------------------------------------------------------------
test("Cannot insert user with taken email", async () => {
    const mockUser = createMockUser();
    await UserRecord.insertUser(mockUser);
    mockUser.username = `random${Math.floor(Math.random() * 10000)}${1}`;
    mockUser._id = new ObjectId();
    try {
        await UserRecord.insertUser(mockUser);

    } catch (error) {
        expect(error.message).toBe("This email is already taken! Try another one or try to recover password.");
    }
});
describe("Can delete a user by given id", () => {
    it("should delete a user by given id", async () => {
        try {
            const mockUserId = await insertMockUser();
            await UserRecord.deleteUserById(mockUserId);
            expect(await UserRecord.findUserById(mockUserId)).toBeNull();
        } catch (error) {
            console.log(error.message);
        }
    })
    it("should return false if the user is not found", async () => {

        try {
            const result = await UserRecord.deleteUserById("65b93e151dcda802f5cfa168");
            expect(result).toBe(false);
        } catch (error) {
            console.log(error.message);
        }

    });

});
describe("findAllUsers", () => {
    it("should return an array of UserRecord objects when users are found", async () => {
        expect(UserRecord.findAllUsers).toBeDefined();
    });
});
