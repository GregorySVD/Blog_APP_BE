import {ValidationError} from "../errorHandler";
import {postConfig} from "./post.validation.config";


export const validatePostTitle = (title: string) => {
    const {minlength, maxlength} = postConfig.TITLE;
    if (!title || title.length < minlength || title.length > maxlength) {
        throw new ValidationError(`Title has to be between ${minlength} and ${maxlength} characters long.`);
    }
}
export const validatePostContent = (content: string) => {
    const {minlength, maxlength} = postConfig.CONTENT;
    if (!content || content.length < minlength || content.length > maxlength) {
        throw new ValidationError(`Content has to be between ${minlength} and ${maxlength} characters long.`);
    }
}
