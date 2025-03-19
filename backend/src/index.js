import express from 'express'
import { PORT } from './config/serverConfig.js'
import apiRouter from './routes/apiRoutes.js'
import StatusCodes from 'http-status-codes'
import connectDB from './config/dbconfig.js'
import bullBoardApp from './server/bullboard.js'
import { Server } from 'socket.io'
import { createServer } from 'http'

const app = express()
const server = createServer(app)

const io = new Server(server)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', apiRouter)
app.use(bullBoardApp)
app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({ message: 'pong' })
})

io.on('connection', (socket) => {
  console.log('a user connected', socket.id)
})

server.listen(PORT, async () => {
  console.log('Running on 3000...')
  console.log('For the UI, open http://localhost:3000/admin/queues')
  console.log('Make sure Redis is running on port 6379 by default')
  await connectDB()
})
