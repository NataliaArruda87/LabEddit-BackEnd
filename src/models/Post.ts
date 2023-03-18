import { PostDB, PostModel } from "../types";

export class Post {
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

    public toBusinessModel(): PostModel {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.created_at,
            updated_at: this.updated_at,
            qte_comments: this.qte_comments,
            creator: this.creator
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