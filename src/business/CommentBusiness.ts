import { CommentDatabase } from "../database/CommentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { createCommentInput, CreateCommentOutput, DeleteCommentInput, DeleteCommentOutput, EditCommentInput, EditCommentOutput, LikeDislikeCommentInput } from "../dtos/commentDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Comment } from "../models/Comment"
import { Post } from "../models/Post"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { CommentDB, LikeDislikeComentDB, PostDB, USER_ROLES } from "../types"

export class CommentBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private userDataBase: UserDatabase,
        private commentDatabase: CommentDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) {}

    public createComment = async (input: createCommentInput): Promise<CreateCommentOutput> => {
        
        const { post_id, content, token } = input
        console.log(post_id)

        if (typeof post_id !== "string") {
            throw new BadRequestError("'content' deve ser uma string")
        }

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

        const filterPostById = await this.postDatabase.findById(post_id)
        console.log(filterPostById)
        if(!filterPostById){
            throw new BadRequestError("'Post' não localizado")
        }


        const newComment = new Comment(
            id,
            payload.id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            filterPostById.id
        )

        const newCommentDB = newComment. toCommentDBModel()
        await this.commentDatabase.insertComment(newCommentDB)

        const postDB: PostDB | undefined = await this.postDatabase.findById(post_id)

        if (!postDB) {
            throw new NotFoundError("Post não encontrado")
        }

        const userDB = await this.userDataBase.getUsersById(postDB.creator_id)
        if (!userDB) {
            throw new NotFoundError("Erro ao procurar Id do criador do post")
        }

        const postToUpdate = new Post( 
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            postDB.qte_comments+1,
            userDB

        )

        const postToUpdateDB = postToUpdate.toDBModel()
        await this.postDatabase.updatePost(postDB.id, postToUpdateDB)
        
        const output: CreateCommentOutput = {
            message: "Cmentario criado com sucesso",
            comment: newComment.toCommentDBModel()
        }
    
        return output
    } 

    public editComment = async (input: EditCommentInput): Promise<EditCommentOutput> => {

        const { token, content, idCommentToEdit} = input

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

        const commentDB: CommentDB | undefined = await this.commentDatabase.findCommentById(idCommentToEdit)

        if (!commentDB) {
            throw new NotFoundError("Comentario não encontrado")
        }

        const creatorId = payload.id

        if (commentDB.creator_id !== creatorId) {
            throw new BadRequestError("Somente quem criou o comentario pode edita-lo")
        }

        const editedComment = new Comment(
            commentDB.id,
            commentDB.creator_id,
            commentDB.content,
            commentDB.likes,
            commentDB.dislikes,
            commentDB.created_at,
            commentDB.updated_at,
            commentDB.post_id
        )

        editedComment.setContent(content)
        editedComment.setUpdatedAt(new Date().toISOString())
        
        const updatedComment = editedComment.toCommentDBModel()

        await this.commentDatabase.updateComment(idCommentToEdit, updatedComment)

        const output: EditCommentOutput = {
            message: "Comentario editado com sucesso"
        }
    
        return output
    }

    public deleteComment = async (input: DeleteCommentInput): Promise<DeleteCommentOutput> => {
        const { idCommentToDelete, token} = input

        if (token === undefined) {
            throw new BadRequestError("token está vazio")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token invalido")
        }

        const commentDB: CommentDB | undefined = await this.commentDatabase.findCommentById(idCommentToDelete)

        if (!commentDB) {
            throw new NotFoundError("Comentario não encontrado")
        }

        const creatorId = payload.id

        if (
            payload.role !== USER_ROLES.ADMIN
            && commentDB.creator_id !== creatorId
            ) {
            throw new BadRequestError("Somente quem criou o commentario pode apaga-lo")
        }

        await this.commentDatabase.deleteComment(idCommentToDelete)

        const postDB: PostDB | undefined = await this.postDatabase.findById(commentDB.post_id)

        if (!postDB) {
            throw new NotFoundError("Post não encontrado")
        }

        const userDB = await this.userDataBase.getUsersById(postDB.creator_id)
        
        if (!userDB) {
            throw new NotFoundError("Erro ao procurar Id do criador do post")
        }

        function updateQteComments() {
            if (postDB.qte_comments > 0) {
                return postDB.qte_comments-1
            } else {
                return postDB.qte_comments=0
            }
        }

        const postToUpdate = new Post( 
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            updateQteComments(),
            userDB
        )

        const postToUpdateDB = postToUpdate.toDBModel()
        await this.postDatabase.updatePost(postDB.id, postToUpdateDB)
        

        const output: DeleteCommentOutput = {
            message: "Comentario deletado com sucesso"
        }
    
        return output

    }

    public likeOrDislikeComment = async (input:  LikeDislikeCommentInput): Promise<void> => {
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

        const commentDB: CommentDB | undefined = await this.commentDatabase.findCommentById(idToLikeDislike)

        if (!commentDB) {
            throw new NotFoundError("Comentario não encontrado")
        }

        const userId = payload.id

        const likeBancoDados = like ? 1 : 0

        const likeDislike: LikeDislikeComentDB = {
            user_id: userId,
            comment_id: commentDB.id,
            like: likeBancoDados
        }

        const comment = new Comment(
            commentDB.id,
            commentDB.creator_id,
            commentDB.content,
            commentDB.likes,
            commentDB.dislikes,
            commentDB.created_at,
            commentDB.updated_at,
            commentDB.post_id
        )

        const commentLikeDislikeExists = await this.commentDatabase.findLikeDislike(likeDislike)

        if (commentLikeDislikeExists === "já deu like") {
            if (like) {
                await this.commentDatabase.removeLikeDislike(likeDislike)
                comment.removeLike()
            } else {
                await this.commentDatabase.updateLikeDislike(likeDislike)
                comment.removeLike()
                comment.addDislike()
            }
        
        } else if (commentLikeDislikeExists === "já deu dislike") {
            if (like) {
                await this.commentDatabase.removeLikeDislike(likeDislike)
                comment.removeDislike()
                comment.addLike()
            } else {
                await this.commentDatabase.updateLikeDislike(likeDislike)
                comment.removeDislike()
            }
        } else {
            await this.commentDatabase.likeDislikeComment(likeDislike)

            if (like) {
                comment.addLike()
            } else {
                comment.addDislike()
            }  
        }

        const updatedComment = comment.toCommentDBModel()

        await this.commentDatabase.updateComment(idToLikeDislike, updatedComment)
    }
}
        