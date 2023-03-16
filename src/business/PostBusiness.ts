import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { GetPostsWithCommentInput } from "../dtos/commentDTO"
import { CreatePostInput, CreatePostOutput, DeletePostInput, EditPostInput, GetPostInput, GetPostsOutput, LikeDislikePostInput } from "../dtos/postDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Post } from "../models/Post"
import { PostWithComments } from "../models/PostWithComments"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { LikeDislikeDB, PostDB, USER_ROLES } from "../types"

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private userDataBase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) {}

    public getPosts = async (input: GetPostInput): Promise<GetPostsOutput> => {
        
        const { q, token } = input

        if (typeof q !== "string" && q !== undefined) {
            throw new BadRequestError("'q' deve ser string ou undefined")
        }

        if (typeof token !== "string") {
            throw new BadRequestError("token está vazio")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token não é valido")
        }

        const {
            postsDB,
            usersDB
        } = await this.postDatabase.getPostsWithUsers(q)

        function getUser(userId: string) {
            const user = usersDB.find((userDB) => {
                return userDB.id === userId
            })  

            return {
                id: user.id,
                name: user.name
            }
        }

        const posts = postsDB.map((postDB) => {
            const post = new Post(
                postDB.id,
                postDB.content,
                postDB.likes,
                postDB.dislikes,
                postDB.created_at,
                postDB.updated_at,
                postDB.qte_comments,
                getUser(postDB.creator_id)
            ) 

            return post.toBusinessModel()
        })

        return posts
        
    }

    public getPostsWithComments = async (input: GetPostsWithCommentInput) => {

        const {q, token} = input

        if (typeof q !== "string" && q !== undefined) {
            throw new BadRequestError("'q' deve ser string ou undefined")
        }

        if (typeof token !== "string") {
            throw new BadRequestError("token está vazio")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token não é valido")
        }  

        const {
            postsDB,
            usersDB,
            commentsDB,
        } = await this.postDatabase.getPostsWithComments(q)
        
        function getUser(userId: string) {
            const user = usersDB.find((userDB) => {
                return userDB.id === userId
            })  

            return {
                id: user.id,
                name: user.name
            }
        }

        function getComments(postId:string):any {
            const comments = commentsDB.filter((commentDB)=>{
                return commentDB.post_id === postId
            })

            return comments
        }


        const posts = postsDB.map((postDB) => {
            const post = new PostWithComments(
                postDB.id,
                postDB.content,
                postDB.likes,
                postDB.dislikes,
                postDB.created_at,
                postDB.updated_at,
                postDB.qte_comments,
                getUser(postDB.creator_id),
                getComments(postDB.id)
            ) 

            return post.toBusinessPostWithCommentsModel()
        })

        return posts    
    }

    public createPost = async (input: CreatePostInput): Promise<CreatePostOutput> => {
        
        const { content, token } = input

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser uma string")
        }

        if (content.length < 2) {
            throw new BadRequestError("'content' deve possuir pelo menos 2 caracteres")
        }

        if (typeof token !== "string") {
            throw new BadRequestError("token está vazio")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token invalido")
        }

        const id = this.idGenerator.generate()


        const newPost = new Post(
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            0,
            payload
        )

        
        const newPostDB = newPost.toDBModel()
        await this.postDatabase.insertPost(newPostDB)

        const output: CreatePostOutput = {
            message: "Post criado com sucesso",
            post: newPost.toBusinessModel()
        }

        return output

    }

    public editPost = async (input: EditPostInput): Promise<CreatePostOutput> => {

        const { token, content, idToEdit} = input

        if (token === undefined) {
            throw new BadRequestError("token está vazio")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token invalido")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser um string" )
        }

        if (content.length < 2) {
            throw new BadRequestError("'content' deve possuir pelo menos 2 caracteres")
        }

        const postDB: PostDB | undefined = await this.postDatabase.findById(idToEdit)


        if (!postDB) {
            throw new NotFoundError("Post não encontrado")
        }

        const creatorId = payload.id

        if (postDB.creator_id !== creatorId) {
            throw new BadRequestError("Somente quem criou o post pode edita-lo")
        }

        const userDB = await this.userDataBase.getUsersById(postDB.creator_id)
        if (!userDB) {
            throw new NotFoundError("Erro ao procurar Id do criador do post")
        }

        const editedPost = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            postDB.qte_comments,
            userDB
        )

        editedPost.setContent(content)
        editedPost.setUpdatedAt(new Date().toISOString())
        
        const updatedPost = editedPost.toDBModel()

        await this.postDatabase.updatePost(idToEdit, updatedPost)

        const output: CreatePostOutput = {
            message: "Post editado com sucesso",
            post: editedPost.toBusinessModel()
        }
    
        return output

    }

    public deletePost = async (input: DeletePostInput): Promise<void> => {
        const { idToDelete, token} = input

        if (token === undefined) {
            throw new BadRequestError("token está vazio")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token invalido")
        }

        const postDB = await this.postDatabase.findById(idToDelete)

        if (!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (
            payload.role !== USER_ROLES.ADMIN
            && postDB.creator_id !== creatorId
            ) {
            throw new BadRequestError("Somente quem criou o post pode apaga-lo")
        }

        await this.postDatabase.deletePost(idToDelete)
    }

    public likeOrDislikePost = async (input: LikeDislikePostInput): Promise<void> => {
        const { idToLikeDislike, token, like } = input
        if (token === undefined) {
            throw new BadRequestError("token está vazio")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token invalido")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser booleano")
        }

        const postWithCreatorDB = await this.postDatabase.findPostWithCreatorById(idToLikeDislike)

        if (!postWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const userId = payload.id

        const likeBancoDados = like ? 1 : 0

        const likeDislike: LikeDislikeDB = {
            user_id: userId,
            post_id: postWithCreatorDB.id,
            like: likeBancoDados
        }

        const post = new Post (
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            postWithCreatorDB.qte_comments,
            payload 
            )

        const posLikeDislikeExists = await this.postDatabase.findLikeDislike(likeDislike)

        if (posLikeDislikeExists === "já deu like") {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislike)
                post.removeLike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislike)
                post.removeLike()
                post.addDislike()
            }
        
        } else if (posLikeDislikeExists === "já deu dislike") {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislike)
                post.removeDislike()
                post.addLike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislike)
                post.removeDislike()
            }
        } else {
            await this.postDatabase.likeDislikePost(likeDislike)

            if (like) {
                post.addLike()
            } else {
                post.addDislike()
            }
            
        }

        const updatedPost = post.toDBModel()

        await this.postDatabase.updatePost(idToLikeDislike, updatedPost)
        
    
    }        
}