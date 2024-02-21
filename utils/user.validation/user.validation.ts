import {usersDB} from "../mongodb";
import {userConfig} from "./user.validation.config";
import {ValidationError} from "../errorHandler";


//CHECKING IF USERNAME IS UNIQUE
export const isUsernameUnique = async (username: string): Promise<boolean> => {
    const result = await usersDB.findOne({"username": username});
    return !result;
}
//CHECKING IF EMAIL IS UNIQUE
export const isEmailUnique = async (email: string): Promise<boolean> => {
    const result = await usersDB.findOne({"email": email});
    return !result;
}

//VALIDATION

//USERNAME

export const usernameValidator = async (username: string): Promise<boolean> => {
    const {minlength, maxlength} = userConfig.USERNAME;
    if (!username) {
        throw new ValidationError("Invalid username: Username cannot be empty");
    }
    if (username.length < minlength || username.length > maxlength) {
        throw new ValidationError(`Invalid username: Must be between ${minlength} and ${maxlength} characters long`);
    }
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!usernameRegex.test(username)) {
        throw new ValidationError("Usernames can only contain letters, numbers, underscores (_), periods (.), and hyphens (-). Please try again.");
    }
    if (!await isUsernameUnique(username)) {
        throw new ValidationError("Invalid username: This username is already taken")
    }
    return true;
};

//EMAIL

export const emailValidator = async (email: string): Promise<boolean> => {

    if (!email) {
        throw new ValidationError("Invalid email: Email cannot be empty");
    }
    const {minlength, maxlength} = userConfig.EMAIL;
    if (email.length < minlength || email.length > maxlength) {
        throw new ValidationError(`Invalid email: Must be between ${minlength} and ${maxlength} characters long`);
    }
    const emailRegex = /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new ValidationError("Please enter a valid email address. Double-check for typos and make sure it includes: a username, an '@' symbol, and a domain name (e.g., example@gmail.com).");
    }
    if (!await isEmailUnique(email)) {
        throw new ValidationError("Invalid email: This email is already taken.");
    }
    return true;
};

//PASSWORD

export const passwordValidator = async (password: string): Promise<boolean> => {
    if (!password) {
        throw new ValidationError("Invalid password: Password cannot be empty");
    }
    const {minlength, maxlength} = userConfig.PASSWORD;
    if (password.length < minlength || password.length > maxlength) {
        throw new ValidationError(`Invalid password: Must be between ${minlength} and ${maxlength} characters long`);
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()<>?{}[\]_+|~-]).*$/;
    if (!passwordRegex.test(password)) {
        throw new ValidationError("Invalid password: Must contain at least one uppercase letter, lowercase letter, number, and special character");
    }
    return true;
};
