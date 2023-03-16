import { PostModel } from "../types";

export interface GetPostInput {
    q: unknown
    token: string | undefined
}

export type GetPostsOutput = PostModel[]

export interface CreatePostInput {
    content: string,
    token: string | undefined
}

export interface CreateEditInput {
    content: unknown,
    token: string | undefined,
    id: string
}


export interface CreatePostOutput {
    message: string,
    post: PostModel
}

export interface DeletePostInput {
    idToDelete: string,
    token: string | undefined
}

export interface EditPostInput {
    idToEdit: string,
    token: string | undefined,
    content: unknown
}

export interface LikeDislikePostInput {
    idToLikeDislike: string,
    token: string | undefined,
    like: unknown
}