import {UserRecord} from "../records/user.record";
import {UserEntity} from "../types";
import {ObjectId} from "mongodb";


const mockUser: UserEntity = {
    _id: new ObjectId(),
    username: "aaaa",
    password: "Aasz!132",
    email: "email@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
}
const wrongPasswordUser: UserEntity = {
    ...mockUser,
    password: "wrongpassword"
}
const wrongUsernameUser: UserEntity = {
    ...mockUser,
    username: "aa"
}
const invalidEmailUser: UserEntity = {
    ...mockUser,
    email: "aa"
}

test("Can build new UserRecord", async () => {
    const userRecordTest = new UserRecord(mockUser);
    expect(userRecordTest.username).toBe(mockUser.username);
    expect(mockUser._id).toBeInstanceOf(ObjectId);
    expect(userRecordTest.password).toBe(mockUser.password);
    expect(userRecordTest.email).toBe(mockUser.email);
    expect(userRecordTest.createdAt).toBe(mockUser.createdAt);
    expect(userRecordTest.updatedAt).toBe(mockUser.updatedAt);

    console.log("UserRecord successfully created with correct values");
});

test("Can insert new user", async () => {
    const userRecordTest = new UserRecord(mockUser);
    await userRecordTest.insert();
    expect(userRecordTest._id).toBeDefined();

});
test("Wrong password throws error", async () => {
    const userRecord = new UserRecord(wrongPasswordUser);
    const insertUser = async () => await userRecord.insert();
    await expect(insertUser).rejects.toThrowError("Invalid password");
});
test("Wrong username throws error", async () => {
    const userRecord = new UserRecord(wrongUsernameUser);
    const insertUser = async () => await userRecord.insert();
    await expect(insertUser).rejects.toThrowError("Invalid username");
});
test("Invalid email throws an error", async () => {
    const userRecord = new UserRecord(invalidEmailUser);
    const insertUser = async () => await userRecord.insert();

    await expect(insertUser).rejects.toThrowError("Invalid email");
});
