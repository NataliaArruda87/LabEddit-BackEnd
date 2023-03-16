import express from 'express'
import cors from 'cors'
import { postRouter } from './routers/postRouter'
import { userRouter } from './routers/userRouter'
import { commentRouter } from './routers/commentRouter'
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.listen(Number(process.env.PORT), () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT)}`)
})

app.use("/posts", postRouter)
app.use("/users", userRouter)
app.use("/comments", commentRouter)

