import { Router } from 'express'
import authRouter from './auth/auth-router'
import songRouter from './songs/songs-router'

const globalRouter = Router()

globalRouter.use('/auth', authRouter)
globalRouter.use('/songs', songRouter)

export default globalRouter
