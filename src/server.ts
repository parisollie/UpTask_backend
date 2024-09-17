import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { corsConfig } from './config/cors'
import { connectDB } from './config/db'
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'

//Vid 444
dotenv.config()
connectDB()

//Vid 440
const app = express()
//Vid 484
app.use(cors(corsConfig))

//Vid 499 ,Logging
app.use(morgan('dev'))

//Vid 499 Leer datos de formularios
app.use(express.json())

//Vid 528Routes
app.use('/api/auth', authRoutes)
//Vid 447
app.use('/api/projects', projectRoutes)

//Vid 440
export default app