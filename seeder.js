import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'

import connectDb from './config/db.js'
import User from './models/userModel.js'
import Chat from './models/chatModel.js'
import { users } from './data/users.js'
import { chats } from './data/chats.js'

// set up
dotenv.config()
connectDb()

const insertData = async () => {
  try {
    await User.deleteMany()
    await Chat.deleteMany()

    const createdUsers = await User.create(users)
    const [user1, user2, user3, user4] = createdUsers

    const formattedChats = chats.map((chatObjet, i) => {
      if (i % 2 === 0) {
        const formattedSingleChats = chatObjet.chat.map((singleChat, index) => {
          if (index % 2 === 0) {
            return { ...singleChat, sender: user1._id }
          } else {
            return { ...singleChat, sender: user2._id }
          }
        })
        return {
          ...chatObjet,
          chat: formattedSingleChats,
          user: user1._id,
          sender: user2._id,
        }
      } else {
        const formattedSingleChats = chatObjet.chat.map((singleChat, index) => {
          if (index % 2 === 0) {
            return { ...singleChat, sender: user3._id }
          } else {
            return { ...singleChat, sender: user1._id }
          }
        })
        return {
          ...chatObjet,
          chat: formattedSingleChats,
          user: user1._id,
          sender: user3._id,
        }
      }
    })

    await Chat.create(formattedChats)

    console.log('Data inserted successfully'.green.bold)
    process.exit()
  } catch (error) {
    console.log(`${error}`.red.inverse)
    process.exit(1)
  }
}

const deleteData = async () => {
  try {
    await User.deleteMany()
    await Chat.deleteMany()
    console.log('data deleted successfully'.green.bold)
    process.exit()
  } catch (error) {
    console.log(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '--insert-data') {
  insertData()
} else if (process.argv[2] === '--delete-data') {
  deleteData()
} else {
  console.log('Please provide a valid command'.red.inverse.bold)
  process.exit(1)
}
