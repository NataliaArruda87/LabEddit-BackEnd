import { Request, Response } from "express"
import { CommentBusiness } from "../business/CommentBusiness"
import { createCommentInput, DeleteCommentInput, EditCommentInput, LikeDislikeCommentInput } from "../dtos/commentDTO"


export class CommentController {
    constructor(
        private commentBusiness: CommentBusiness
    ){}

    public createComment = async (req: Request, res: Response) => {
        try {
            const input: createCommentInput = {
                post_id: req.body.post_id,
                content: req.body.content,
                token: req.headers.authorization
            }

            const output = await this.commentBusiness.createComment(input)

            res.status(201).send(output)
            
        } catch (error) {
            console.log(error)
        
            if (req.statusCode === 200) {
                res.status(500)
            }
        
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }          
        }
    }

    public editComment = async (req: Request, res: Response) => {
        try {
            const input: EditCommentInput= {
               idCommentToEdit: req.params.id,
               content: req.body.content,
               token: req.headers.authorization
            }

            const output = await this.commentBusiness.editComment(input)

            res.status(201).send(output)
    
        } catch (error) {
            console.log(error)
        
            if (req.statusCode === 200) {
                res.status(500)
            }
        
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }          
        }
    }

    public deleteComment = async (req: Request, res: Response) => {
        try {
            const input:  DeleteCommentInput = {
                idCommentToDelete: req.params.id,
                token: req.headers.authorization
            }

            const output = await this.commentBusiness.deleteComment(input)
            
            res.status(201).send(output)

        } catch (error) {
            console.log(error)
        
            if (req.statusCode === 200) {
                res.status(500)
            }
        
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }          
        }
    }

    public likeOrDislikeComment = async (req: Request, res: Response) => {
        try {
            const input: LikeDislikeCommentInput  = {
                idToLikeDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }

            await this.commentBusiness.likeOrDislikeComment(input)
            
            res.status(200).end()
            
        } catch (error) {
            console.log(error)
        
            if (req.statusCode === 200) {
                res.status(500)
            }
        
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }          
        }
    }
}