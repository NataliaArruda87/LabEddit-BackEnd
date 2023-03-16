import express from "express";
import { PostBusiness } from "../business/PostBusiness";
import { PostController } from "../controller/PostController";
import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export const postRouter = express.Router()

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new UserDatabase(),
        new IdGenerator(),
        new TokenManager()
    )  
)

postRouter.get('/', postController.getPosts)
postRouter.get('/comments', postController.getPostsWithComments)
postRouter.post("/", postController.createPosts)
postRouter.put('/:id', postController.editPost)
postRouter.delete('/:id', postController.deletePost)
postRouter.put('/:id/like', postController.likeOrDislikePost)