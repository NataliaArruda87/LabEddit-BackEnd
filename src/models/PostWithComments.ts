import { CommentDB, CommentWithCreatorDB, PostDB, PostModel, PostWithCommentsDB } from "../types";

export class PostWithComments {
    constructor(
        private id: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private created_at: string,
        private updated_at: string,
        private qte_comments: number,
        private creator: {
            id: string,
            name: string
        },
        private comments_post: CommentWithCreatorDB,

    ){}

    public toDBModel(): PostDB {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.created_at,
            updated_at: this.updated_at,
            qte_comments: this.qte_comments,
            creator_id: this.creator.id
        }

    }

    
    public toBusinessPostWithCommentsModel(): PostWithCommentsDB {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.created_at,
            updated_at: this.updated_at,
            qte_comments: this.qte_comments,
            creator: this.creator,
            comments_post: this.comments_post
        }
    }

    public toCommentDBModel(): CommentDB {
        return {
            id:this.comments_post.id,
            creator_id: this.comments_post.creator.creator_id,
            content: this.comments_post.content,
            likes: this.comments_post.likes,
            dislikes: this.comments_post.dislikes,
            created_at: this.comments_post.created_at,
            updated_at: this.comments_post.updated_at,
            post_id: this.comments_post.post_id,
        }
    }
    
    public getId(): string {
        return this.id
    }

    public setId(value: string) {
        this.id = value
    }

    public getContent(): string {
        return this.content
    }

    public setContent(value: string): void {
        this.content = value
    }

    public getLikes(): number {
        return this.likes
    }

    public setLikes(value: number): void {
        this.likes = value
    }
    public addLike() {
        this.likes += 1
    }

    public removeLike() {
        this.likes -= 1
    }

    public getDislikes(): number {
        return this.dislikes
    }

    public setDislikes(value: number) {
        this.dislikes = value
    }

    public addDislike() {
        this.dislikes += 1
    }

    public removeDislike() {
        this.dislikes -= 1
    }

    public getCreatedAt(): string {
        return this.created_at
    }

    public setCreatedAt(value: string) {
        this.created_at = value
    }

    public getUpdatedAt(): string {
        return this.updated_at
    }

    public setUpdatedAt(value: string) {
        this.updated_at = value
    }

    public getQteComments(): number {
        return this.qte_comments
    }

    public setQteComments(value: number) {
        this.qte_comments = value
    }

    public getCreator(): {
        id: string
        name: string
    } {
        return this.creator
    }

    public setCreator(value: {
        id: string
        name: string
    }) {
        this.creator = value;
    }  

}