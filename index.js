import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import colors from 'colors'

import connectDb from './config/db.js'
import { notFound, errorHandler } from './middleware/errMiddleware.js'

// routes
import userRoutes from './routes/userRoutes.js'

// dot env config
dotenv.config()

// Connect with the database
connectDb()

// initialize app
const app = express()
const server = createServer(app)

app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.get('/', (_req, res) => {
  res.send('API is running')
})

app.use('/api/v1/users', userRoutes)

// error handlers
app.use(errorHandler)
app.use(notFound)

// listening
const port = process.env.PORT || 5000

server.listen(port, () => {
  console.log(`Server started on port ${port}`.yellow.bold)
})
