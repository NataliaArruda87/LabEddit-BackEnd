import { CommentDB } from "../types";

export class Comment {
    constructor(
        private id: string,
        private creator_id: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private created_at: string,
        private updated_at: string,
        private post_id: string,
    ){}

    public toCommentDBModel(): CommentDB {
        return {
            id:this.id,
            creator_id: this.creator_id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.created_at,
            updated_at: this.updated_at,
            post_id: this.post_id,
        }
    }

    public getId(): string {
        return this.id
    }

    public setId(value: string) {
        this.id = value
    }

    public getCreatorId(): string {
        return this.creator_id
    }

    public setCreatorId(value: string) {
        this.creator_id = value
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

    public getPostId(): string {
        return this.post_id
    }

    public setPostId(value: string) {
        this.post_id = value
    }

}