import { Request, Response } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { GetPostsWithCommentInput } from "../dtos/commentDTO"
import {  CreatePostInput, DeletePostInput, EditPostInput, GetPostInput, LikeDislikePostInput } from "../dtos/postDTO"

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ){}

    public getPosts = async (req: Request, res: Response) => {
        try {

            const input: GetPostInput = {
                q: req.query.q,
                token: req.headers.authorization
            }
         

            const output = await this.postBusiness.getPosts(input)

            res.status(200).send(output)
    
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

    public getPostsWithComments = async (req: Request, res: Response) => {
        try {

            const input: GetPostsWithCommentInput = {
                q: req.query.q,
                token: req.headers.authorization
            }
         
            const output = await this.postBusiness.getPostsWithComments(input)

            res.status(200).send(output)
    
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

    public createPosts = async (req: Request, res: Response) => {
        try {
            const input: CreatePostInput = {
                content: req.body.content,
                token: req.headers.authorization
            }

            const output = await this.postBusiness.createPost(input)

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

    public editPost = async (req: Request, res: Response) => {
        try {
            const input: EditPostInput = {
               idToEdit: req.params.id,
               content: req.body.content,
               token: req.headers.authorization
            }

            const output = await this.postBusiness.editPost(input)

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


    public deletePost = async (req: Request, res: Response) => {
        try {
            const input:  DeletePostInput = {
                idToDelete: req.params.id,
                token: req.headers.authorization
            }

            await this.postBusiness.deletePost(input)
            
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

    public likeOrDislikePost = async (req: Request, res: Response) => {
        try {
            const input: LikeDislikePostInput  = {
                idToLikeDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }

            await this.postBusiness.likeOrDislikePost(input)
            
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