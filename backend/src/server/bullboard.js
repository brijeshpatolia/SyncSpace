import express from 'express'
import { createBullBoard } from '@bull-board/api'
import { ExpressAdapter } from '@bull-board/express'
import { BullAdapter } from '@bull-board/api/bullAdapter.js' // ✅ Correct import for Bull queues
import { mailQueue } from '../queues/queueManager.js'

const bullBoardApp = express()
const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin/queues')

createBullBoard({
  queues: [new BullAdapter(mailQueue)],
  serverAdapter
})

bullBoardApp.use('/admin/queues', serverAdapter.getRouter())

export default bullBoardApp
