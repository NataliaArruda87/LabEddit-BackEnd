import { LikeDislikeDB, PostDB, PoststWithCreatorDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
   public static TABLE_POSTS = "posts"
   public static TABLE_LIKE_DISLIKES_POSTS = "likes_dislikes_posts"
   public static TABLE_COMMENTS = "comments"
   public static TABLE_USERS = "users"
    
    public getAllPosts = async () => {
        const postsDB = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select()

        return postsDB
    }

    public getPostsWithUsers = async (q: string | undefined | unknown) => {
        
        let postsDB: PostDB[]
        if (q) {
            postsDB = await this.getPostsById(q)
        } else {
            postsDB = await this.getAllPosts()
        }

        const usersDB = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .select()

        return {
            postsDB,
            usersDB
        }
    }

    public getPostsById = async (q: string | unknown) => {
        const postsDB= await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select()
            .where({id:q})

        return postsDB
    }


    public findById = async (id: string): Promise<PostDB | undefined> => {
        const result: PostDB[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .select()
        .where({ id: id })

        return result[0]
    }

    public async insertPost(newPostDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(newPostDB)
    }

    public updatePost = async (id: string, postDB: PostDB):Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .update(postDB)
            .where({ id })
    }

    public deletePost = async (id: string): Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .delete()
        .where({ id })
    }

    public likeDislikePost = async (likeDislike: LikeDislikeDB): Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_LIKE_DISLIKES_POSTS)
        .insert(likeDislike)
    }

    public findPostWithCreatorById = async (
        postId: string
    ): Promise<PoststWithCreatorDB | undefined> => {
        const result: PoststWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "posts.id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.created_at",
                "posts.updated_at",
                "posts.creator_id",
                "users.name AS creator_name"
            )
            .join("users", "posts.creator_id", "=", "users.id")
            .where("posts.id", postId)
        
        return result[0]
    }

    public findLikeDislike = async (likeDislike: LikeDislikeDB): Promise<"já deu like" | "já deu dislike" | null> => {
        const [ likeDislikeDB ]: LikeDislikeDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_LIKE_DISLIKES_POSTS)
            .select()
            .where({
                user_id: likeDislike.user_id,
                post_id:  likeDislike.post_id
            })

            if (likeDislikeDB) {
                return likeDislikeDB.like === 1 ? "já deu like" : "já deu dislike"
            } else {
                return null
            }
    }

    public removeLikeDislike = async (likeDislike: LikeDislikeDB): Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_LIKE_DISLIKES_POSTS)
        .delete()
        .where({
            user_id: likeDislike.user_id,
            post_id:  likeDislike.post_id
        })
    }

    public updateLikeDislike = async (likeDislike: LikeDislikeDB) => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_LIKE_DISLIKES_POSTS)
        .update(likeDislike)
        .where({
            user_id: likeDislike.user_id,
            post_id:  likeDislike.post_id
        })
    }
    

    public getPostsWithComments = async(q: string| undefined | unknown) => {
        let postsDB: PostDB[]
        if (q) {
            postsDB = await this.getPostsById(q)
        } else {
            postsDB = await this.getAllPosts()
        }

        const usersDB = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .select()
        
        const commentsDB = await BaseDatabase
        .connection(PostDatabase.TABLE_COMMENTS)
        .select("comments.*","users.name")
        .leftJoin(PostDatabase.TABLE_USERS, "users.id", "=", "comments.creator_id")
    
        return {
            postsDB,
            usersDB,
            commentsDB    
        }
    } 
}