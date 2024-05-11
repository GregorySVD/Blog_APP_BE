import {Router, Response, Request} from "express";
import {ValidationError} from "../utils/errorHandler";
import {PostRecord} from "../records/post.record";

export const postRoute = Router();

postRoute
    //GET route to retrieve portion of list of posts
    .get("/", async (req: Request, res: Response) => {
        try {
            const page: number = Number(req.query.page || 1);
            const pageSize: number = Number(req.query.pageSize) || 12;
            const posts = await PostRecord.getPostsPaginationList(page, pageSize);

            res.json({
                posts,
                currentPage: page,
                pageCount: Math.ceil(((await PostRecord.getPostsList()).length) / pageSize)
            });
        } catch (err) {
            throw new ValidationError(err.message);
        }
    })

    // POST route to insert new Post
    .post("/", async (req: Request, res: Response) => {
        try {
            const newPost = new PostRecord(req.body);
            const insertedPostId = await newPost.insertOne();
            res.json({message: `Post with id: ${insertedPostId} inserted successfully!`});
        } catch (err) {
            throw new ValidationError(`Error while inserting new post: ${err.message}`);
        }
    })
    // GET route to retrieve single Post
    .get("/:id", async (req: Request, res: Response) => {
        try {
            const result = await PostRecord.getOne(req.params.id)
            if(!result) {
                res.status(404).json({error: `Post with id ${req.params.id} does not exist`});
            } else {
                await res.json(result);
            }
        } catch (err) {
            res.json({error: err.message});
        }
    })
    // DELETE route to delete single Post by id
    .delete("/:id", async (req: Request, res: Response) => {
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
    // PUT route to update post title
    .put("/title/:id", async (req: Request, res: Response) => {
        try {
            const post = await PostRecord.getOne(req.params.id);
            if (!post) {
                res.status(404).json({error: `Post with id ${req.params.id} does not exist`});
            }
            const result = await post.updateTitle(req.body.title);
            res.json(result);
        } catch (err) {
            throw new ValidationError(`Error while updating post title: ${err.message}`);
        }
    })
    // PUT route to update post content
    .put("/content/:id", async (req: Request, res: Response) => {
        try {
            const post = await PostRecord.getOne(req.params.id);
            if (!post) {
                res.status(404).json({error: `Post with id ${req.params.id} does not exist`});
            }
            const result = await post.updateContent(req.body.content);
            res.json(result);
        } catch (err) {
            throw new ValidationError(`Error while updating post content: ${err.message}`);
        }
    })
    // PUT route to update post image
    .put("/image/:id", async (req: Request, res: Response) => {
        try {
            const post = await PostRecord.getOne(req.params.id);
            if (!post) {
                res.status(404).json({error: `Post with id ${req.params.id} does not exist`});
            }
            const result = await post.updateImage(req.body.imageUrl);
            res.json(result);
        } catch (err) {
            throw new ValidationError(`Error while updating post image: ${err.message}`);
        }
    })
    // PUT route to increment post likes count
    .put("/increment-likes/:id", async (req: Request, res: Response) => {
        try {
            const post = await PostRecord.getOne(req.params.id);
            if (!post) {
                res.status(404).json({error: `Post with id ${req.params.id} does not exist`});
            }
            const result = await post.incrementLikesCount();
            res.json(result);
        } catch (err) {
            throw new ValidationError(`Error while incrementing post likes ${err}`);
        }
    })
    // PUT route to decrement post likes count
    .put("/decrement-likes/:id", async (req: Request, res: Response) => {
        try {
            const post = await PostRecord.getOne(req.params.id);
            if (!post) {
                res.status(404).json({error: `Post with id ${req.params.id} does not exist`});
            }
            const result = await post.decrementLikesCount();
            await console.log(post.likesCounter);
            res.json(result);
        } catch (err) {
            throw new ValidationError(`Error while incrementing post likes ${err}`);
        }
    });
