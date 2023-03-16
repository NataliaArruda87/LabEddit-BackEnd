import { CommentDB } from "../types"

export interface GetPostsWithCommentInput {
    q: unknown
    token: string | undefined 
}

export interface createCommentInput {
    post_id: string
    content: string 
    token: string | undefined 
}

export interface CreateCommentOutput {
    message: string,
    comment: CommentDB
}

export interface EditCommentInput {
    idCommentToEdit: string,
    content: string,
    token: string | undefined 
}

export interface EditCommentOutput {
    message: string,
}

export interface DeleteCommentInput {
    idCommentToDelete: string,
    token: string | undefined 
}

export interface DeleteCommentOutput {
    message: string,
}

export interface LikeDislikeCommentInput {
    idToLikeDislike: string,
    token: string | undefined,
    like: unknown
}


