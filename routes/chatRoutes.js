import express from 'express'
import {
  getAllChats,
  getAllChatsByUserId,
  getChatById,
  getChatContacts,
  sendMessageByChatId,
} from '../controllers/chatControllers.js'
import { authorize, protectRoute } from '../middleware/authMiddleware.js'

const chatRouter = express.Router()

chatRouter.route('/').get(protectRoute, authorize('admin'), getAllChats)
chatRouter
  .route('/chat/:id')
  .get(protectRoute, getChatById)
  .post(protectRoute, sendMessageByChatId)
chatRouter.route('/:userId').get(protectRoute, getAllChatsByUserId)
chatRouter.route('/:userId/contacts').get(protectRoute, getChatContacts)

export default chatRouter
