import {Router, Response, Request} from "express"
import {ValidationError} from "../utils/errorHandler";
import {PostRecord} from "../records/post.record";


export const postRoute = Router();

postRoute
    // GET route to retrieve list of Post
    .get("/", async (req: Request, res: Response) => {
        try {
            const result = await PostRecord.getPostsList();
            res.json(result);
        } catch (err) {
            throw new ValidationError(err.message);
        }
    })
    //POST route to insert new Post
    .post("/", async (req, res) => {
        try {
            const newPost = new PostRecord(req.body);
            const insertedPostId = await newPost.insertOne();
            res.json({message: `Post with id: ${insertedPostId} inserted successfully!`});
        } catch (err) {
            throw new ValidationError(`Error while inserting new post: ${err.message}`);
        }
    })
    // GET route to retrieve single Post
    .get("/:id", async (req, res) => {
        try {
            const result = await PostRecord.getOne(req.params.id);
            if (!result) {
                res.status(404).json({error: `Post with id ${req.params.id} does not exist`});
            } else {
                res.json(result);
            }
        } catch (err) {
            throw new ValidationError(`Error getting user: ${err.message}`);
        }
    })
    // DELETE route to delete single Post by id
    .delete("/:id", async (req, res) => {
        try {
            const result = await PostRecord.deletePost(req.params.id);
            if (!result) {
                res.status(404).json({error: `Post with id ${req.params.id} does not exist`});
            } else {
                res.json(result);
            }
        } catch (err) {
            throw new ValidationError(`Error while deleting post: ${err.message}`);
        }
    })

//@TODO: Create CRUD methods for updating post: title, content and image
