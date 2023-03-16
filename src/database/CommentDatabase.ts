import { CommentDB, LikeDislikeComentDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class CommentDatabase extends BaseDatabase {
    public static TABLE_COMMENTS = "comments"
    public static TABLE_LIKE_DISLIKES_COMMENTS = "likes_dislikes_comments"

    public async insertComment(newCommentDB: CommentDB) {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .insert(newCommentDB)
    }

    public findCommentById = async (id: string): Promise<CommentDB | undefined> => {
        const result: CommentDB[] = await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .select()
        .where({ id: id })

        return result[0]
    }

    public updateComment = async (id: string, commentDB: CommentDB):Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .update(commentDB)
            .where({ id })
    }

    public deleteComment = async (id: string): Promise<void> => {
        await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .delete()
        .where({ id })
    }

    public findLikeDislike = async (likeDislike: LikeDislikeComentDB): Promise<"já deu like" | "já deu dislike" | null> => {
        const [ likeDislikeDB ]: LikeDislikeComentDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKE_DISLIKES_COMMENTS)
            .select()
            .where({
                user_id: likeDislike.user_id,
                comment_id:  likeDislike.comment_id
            })

            if (likeDislikeDB) {
                return likeDislikeDB.like === 1 ? "já deu like" : "já deu dislike"
            } else {
                return null
            }
    }

    public removeLikeDislike = async (likeDislike: LikeDislikeComentDB): Promise<void> => {
        await BaseDatabase
        .connection(CommentDatabase.TABLE_LIKE_DISLIKES_COMMENTS)
        .delete()
        .where({
            user_id: likeDislike.user_id,
            comment_id:  likeDislike.comment_id
        })
    }

    public updateLikeDislike = async (likeDislike: LikeDislikeComentDB) => {
        await BaseDatabase
        .connection(CommentDatabase.TABLE_LIKE_DISLIKES_COMMENTS)
        .update(likeDislike)
        .where({
            user_id: likeDislike.user_id,
            comment_id:  likeDislike.comment_id
        })
    }

    public likeDislikeComment = async (likeDislike: LikeDislikeComentDB): Promise<void> => {
        await BaseDatabase
        .connection(CommentDatabase.TABLE_LIKE_DISLIKES_COMMENTS)
        .insert(likeDislike)
    }

}