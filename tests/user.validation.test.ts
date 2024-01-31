import {
    emailValidator,
    passwordValidator,
    usernameValidator
} from "../utils/user.validation/user.validation";
import {userConfig} from "../utils/user.validation/user.validation.config";

describe("User validation", () => {


        //@TODO create regex validation
        describe("emailValidator", () => {
            it("should validate a valid email", async () => {
                await expect(emailValidator("valid@email.com")).resolves.toBe(true);
            });

            it("should throw an error for an empty email", async () => {
                await expect(emailValidator("")).rejects.toThrow("Invalid email: Email cannot be empty");
            });
            it("should throw an error for too long email", async () => {
                const longEmail = "a".repeat(255) + "@example.com";

                await expect(emailValidator(longEmail)).rejects.toThrow(`Invalid email: Must be between ${userConfig.EMAIL.minlength} and ${userConfig.EMAIL.maxlength} characters long`);
            });
            it("should throw an error for too short email", async () => {
                const shortEmail = "a@s.co";

                await expect(emailValidator(shortEmail)).rejects.toThrow(`Invalid email: Must be between ${userConfig.EMAIL.minlength} and ${userConfig.EMAIL.maxlength} characters long`);
            });

        });
//PASSWORD VALIDATION
        //@TODO create regex validation
        describe("Password Validator", () => {
            it("should return true on valid password", () => {
                expect(() => passwordValidator("ValidPassword1!")).not.toThrow();
            });
            it("should throw an error for an empty password", async () => {
                await expect(passwordValidator("")).rejects.toThrow("Invalid password: Password cannot be empty");
            });
            it("should throw an error if the password is too short", () => {
                const tooShortPassword = "aa"
                expect(() => passwordValidator(tooShortPassword)).rejects.toThrow(`Invalid password: Must be between ${userConfig.PASSWORD.minlength} and ${userConfig.PASSWORD.maxlength} characters long`);
            })
            it("should throw an error if the password is too long", () => {
                const longPassword = "aB7!".repeat(35);
                expect(() => passwordValidator(longPassword)).rejects.toThrow(`Invalid password: Must be between ${userConfig.PASSWORD.minlength} and ${userConfig.PASSWORD.maxlength} characters long`);
            });
        });
        //USERNAME VALIDATION

    //@TODO
        describe("Username Validator", () => {
            it("should return true on valid username", () => {
                expect(() => usernameValidator("ValidUser13!")).not.toThrow();
            });
            it("should return throw error  for an empty username", () => {
                expect(async () => await usernameValidator("")).rejects.toThrow(`Invalid username: Username cannot be empty`);
            });
            it("should throw an error for an invalid character in the username", async () => {
                const invalidUsername = "Invalid@User";
                await expect(usernameValidator(invalidUsername)).rejects.toThrow("Invalid username: Invalid characters");
            });
            it("should throw an error for a username with spaces", async () => {
                const usernameWithSpaces = "User Name";
                await expect(usernameValidator(usernameWithSpaces)).rejects.toThrow("Invalid username: Invalid characters");
            });
            it("should throw an error if the username is too short", () => {
                const tooShortUsername = "aa"
                expect(() => usernameValidator(tooShortUsername)).rejects.toThrow(`Invalid username: Must be between ${userConfig.USERNAME.minlength} and ${userConfig.USERNAME.maxlength} characters long`);
            })
            it("should throw an error if the username is too long", () => {
                const tooLongUsername = "a".repeat(151);
                expect(() => usernameValidator(tooLongUsername)).rejects.toThrow(`Invalid username: Must be between ${userConfig.USERNAME.minlength} and ${userConfig.USERNAME.maxlength} characters long`);
            });
        });
    }
);
