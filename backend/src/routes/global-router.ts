import { Router } from 'express'
import authRouter from './auth/auth-router'
import { uploadHandler, upload } from './upload-file'

const globalRouter = Router()

globalRouter.use('/auth', authRouter)
globalRouter.post('/upload', upload.single('file'), uploadHandler)

export default globalRouter
