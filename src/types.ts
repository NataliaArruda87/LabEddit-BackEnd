export interface PostDB {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
    qte_comments: number,
    creator_id: string
}


export interface PostModel {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
    qte_comments: number,
    creator: {
        id: string,
        name: string
    }
}

export interface LikeDislikeDB{
    user_id: string,
    post_id: string,
    like: number
}

export interface PoststWithCreatorDB extends PostDB {
    creator_name: string
}

export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}

export interface UserDB {
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLES,
    created_at: string
}

export interface UserModel {
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLES,
    createdAt: string
}

export interface CommentDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    updated_at: string,
    created_at: string,
    post_id: string,
}

export interface CommentWithCreatorDB  {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
    post_id: string,
    creator: {
        creator_id: string,
        creator_name: string,
    }
}

export interface PostWithCommentsDB {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
    qte_comments: number,
    creator: {
        id: string,
        name: string,
    },
    comments_post: CommentWithCreatorDB,
}

export interface LikeDislikeComentDB{
    user_id: string,
    comment_id: string,
    like: number
}





