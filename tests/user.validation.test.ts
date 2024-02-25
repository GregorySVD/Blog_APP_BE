import {
    emailValidator,
    passwordValidator,
    usernameValidator
} from "../utils/user.validation/user.validation";
import {userConfig} from "../utils/user.validation/user.validation.config";

describe("User validation", () => {

// EMAIL VALIDATOR
        describe("emailValidator", () => {
            it("should validate a valid email", async () => {
                await expect(emailValidator("valid@email.com")).resolves.toBe(true);
            });
            it("should validate valid emails", async () => {
                const validEmails = [
                    "john.doe@example.com",
                    "jane.smith123@gmail.com",
                    "user123456@yahoo.co.uk",
                ];

                for (const email of validEmails) {
                    expect(await emailValidator(email)).toBe(true);
                }
            });

            it("should invalidate invalid emails", async () => {
                const invalidEmails = [
                    "invalid-email",
                    "user@example",
                    "user@example..com",
                    "user@example.com.",
                ];

                for (const email of invalidEmails) {
                    await expect(emailValidator(email)).rejects.toThrowError("Please enter a valid email address." +
                        " Double-check for typos and make sure it includes: a username, an '@' symbol, and a domain name (e.g., example@gmail.com).");
                }
            });

            it("should throw an error for an empty email", async () => {
                await expect(emailValidator("")).rejects.toThrow("Invalid email: Email cannot be empty");
            });
            it("should throw an error for too long email", async () => {
                const longEmail = `${"a".repeat(255)}@example.com`;

                await expect(emailValidator(longEmail)).rejects.toThrow(`Invalid email: Must be between ${userConfig.EMAIL.minlength} and ${userConfig.EMAIL.maxlength} characters long`);
            });
            it("should throw an error for too short email", async () => {
                const shortEmail = "a@s.co";

                await expect(emailValidator(shortEmail)).rejects.toThrow(`Invalid email: Must be between ${userConfig.EMAIL.minlength} and ${userConfig.EMAIL.maxlength} characters long`);
            });

        });
// PASSWORD VALIDATION
        describe("Password Validator", () => {
            it("should return true on valid password", () => {
                expect(() => passwordValidator("ValidPassword1!")).not.toThrow();
            });
            it("should throw an error for an empty password", async () => {
                await expect(passwordValidator("")).rejects.toThrow("Invalid password: Password cannot be empty");
            });
            it("should throw an error if the password is too short", () => {
                const tooShortPassword = "aa";
                expect(() => passwordValidator(tooShortPassword)).rejects.toThrow(`Invalid password: Must be between ${userConfig.PASSWORD.minlength} and ${userConfig.PASSWORD.maxlength} characters long`);
            });
            it("should throw an error if the password is too long", () => {
                const longPassword = "aB7!".repeat(35);
                expect(() => passwordValidator(longPassword)).rejects.toThrow(`Invalid password: Must be between ${userConfig.PASSWORD.minlength} and ${userConfig.PASSWORD.maxlength} characters long`);
            });
            it("should throw an error if the password doesn't meet complexity requirements", async () => {
                const weakPasswords = [
                    "lowercaseonly",
                    "UPPERCASEONLY",
                    "12345678",
                    "nospecialchars",
                ];
                for (const password of weakPasswords) {
                    await expect(passwordValidator(password)).rejects.toThrow(
                        "Invalid password: Must contain at least one uppercase letter, lowercase letter, number, and special character"
                    );
                }
            });

        });
        // USERNAME VALIDATION

        describe("Username Validator", () => {
            it("should return true on valid username", () => {
                expect(() => usernameValidator("ValidUser13")).not.toThrow();
            });
            it("should return throw error for an empty username", () => {
                expect(async () => await usernameValidator("")).rejects.toThrow("Invalid username: Username cannot be empty");
            });
            it("should throw an error for an invalid character in the username", async () => {
                const invalidUsername = "Invalid@User";
                await expect(usernameValidator(invalidUsername)).rejects.toThrow("Usernames can only contain letters, numbers, underscores (_), periods (.), and hyphens (-). Please try again.");
            });
            it("should throw an error for a username with spaces", async () => {
                const usernameWithSpaces = "User Name";
                await expect(usernameValidator(usernameWithSpaces)).rejects.toThrow("Usernames can only contain letters, numbers, underscores (_), periods (.), and hyphens (-). Please try again.");
            });
            it("should throw an error if the username is too short", () => {
                const tooShortUsername = "aa";
                expect(() => usernameValidator(tooShortUsername)).rejects.toThrow(`Invalid username: Must be between ${userConfig.USERNAME.minlength} and ${userConfig.USERNAME.maxlength} characters long`);
            });
            it("should throw an error if the username is too long", () => {
                const tooLongUsername = "a".repeat(151);
                expect(() => usernameValidator(tooLongUsername)).rejects.toThrow(`Invalid username: Must be between ${userConfig.USERNAME.minlength} and ${userConfig.USERNAME.maxlength} characters long`);
            });
        });
    }
);
