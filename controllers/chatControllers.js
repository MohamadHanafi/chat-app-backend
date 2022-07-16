import asyncHandler from 'express-async-handler'

import Chat from '../models/chatModel.js'

// @desc    Fetch all Chats
// @route    GET /api/chats
// @access    Private - only admin can access this route
const getAllChats = asyncHandler(async (req, res, next) => {
  try {
    const chats = await Chat.find()
    res.status(200).json(chats)
  } catch (err) {
    res.status(500)
    throw new Error(err)
  }
})

// @desc    Fetch all Chats by user id
// @route    GET /api/chats/:userId
// @access    Private
const getAllChatsByUserId = asyncHandler(async (req, res, next) => {
  const chats = await Chat.find({ user: req.params.userId }).populate('sender')
  if (chats) {
    res.status(200).json(chats)
  } else {
    const user = await User.findById(req.params.userId)
    if (user) {
      res.status(200).json([])
    } else {
      res.status(404)
      throw new Error('Wrong user id')
    }
  }
})

// @desc    Fetch single Chat by id
// @route    GET /api/chats/chat/:id
// @access    Private
const getChatById = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id).populate('sender')
  // update the unseen message count to 0
  chat.unseenMsgs = 0
  await chat.save()
  if (chat) {
    res.status(200).json(chat)
  } else {
    res.status(404)
    throw new Error('Chat not found')
  }
})

// @desc get Chat contacts
// @route GET /api/chats/:userId/contacts
// @access Private
const getChatContacts = asyncHandler(async (req, res, next) => {
  // find chats by the user or the sender of the chat
  const chats = await Chat.find({
    $or: [{ user: req.params.userId }, { sender: req.params.userId }],
  }).populate('sender')
  if (!chats) {
    res.status(200).json([])
  }
  const contacts = chats.map(chat => {
    // get the last message
    const sender = chat.sender
    const lastMessage = chat.chat[chat.chat.length - 1]

    return {
      chatId: chat._id,
      sender,
      lastMessage,
      unseenMsgs: chat.unseenMsgs,
    }
  })
  res.status(200).json(contacts)
})

// @desc    send a msg by chat id
// @route    POST /api/chats/chat/:id
// @access    Private
const sendMessageByChatId = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id)
  if (!chat) {
    res.status(404)
    throw new Error('Chat not found')
  }
  const newMessage = {
    message: req.body.message,
    sender: req.user._id,
  }
  chat.chat.push(newMessage)
  await chat.save()
  res.status(200).json(chat)
})

export {
  getAllChats,
  getAllChatsByUserId,
  getChatById,
  getChatContacts,
  sendMessageByChatId,
}
