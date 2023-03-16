import express from "express";
import { CommentBusiness} from "../business/CommentBusiness";
import { CommentController } from "../controller/CommentController";
import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export const commentRouter = express.Router()

const commentController = new CommentController(
    new CommentBusiness(
        new PostDatabase(),
        new UserDatabase(),
        new CommentDatabase(),
        new IdGenerator(),
        new TokenManager()
    )  
)

commentRouter.post("/", commentController.createComment)
commentRouter.put("/:id", commentController.editComment)
commentRouter.delete("/:id", commentController.deleteComment)
commentRouter.put('/:id/like', commentController.likeOrDislikeComment)
