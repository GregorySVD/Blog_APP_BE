import * as mongoose from "mongoose";

export const usernameValidator = (username: string): boolean => {
    if (!username) return false;

    if (username.length < 3 || username.length > 150) {
        throw new Error('Invalid username: Must be between 3 and 150 characters long');
    }

    const usernameRegex = /^[a-zA-Z0-9_\\.]+$/;
    if (!usernameRegex.test(username)) {
        throw new Error('Invalid username: Invalid characters');
    }
    return true;
};

export const emailValidator = (email: string): boolean => {
    if (!email) return false;

    const regex = /^[\w-]+@([\w-]+\.)+[\w-]+$/;
    if (!regex.test(email)) {
        throw new Error('Invalid email: Invalid email format');
    }
    if (email.length < 3 || email.length > 255) {
        throw new Error('Invalid email: Must be between 3 and 255 characters long');
    }
    return true;
};

export const passwordValidator = (password: string): boolean => {
    if (!password) return false;

    if (password.length < 7 || password.length > 128) {
        throw new Error('Invalid password: Must be between 7 and 128 characters long');
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()<>?{}\[\]_+|~-]).*$/;
    if (!passwordRegex.test(password)) {
        throw new Error('Invalid password: Must contain at least one uppercase letter, lowercase letter, number, and special character');
    }
    return true;
};

export const UserSchema = new mongoose.Schema({
        username: {
            type: String,
            unique: true,
            minLength: 3,
            maxLength: 150,
            validate: usernameValidator,
        },
        password: {
            type: String,
            required: true,
            validate: passwordValidator,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minLength: 3,
            maxLength: 150,
            validate: emailValidator,
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    },
    {timestamps: true});
