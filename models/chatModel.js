import mongoose from 'mongoose'

const singleChatSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  unseenMsgs: {
    type: Number,
    default: 0,
  },
  chat: {
    type: [singleChatSchema],
  },
})

const Chat = mongoose.model('Chat', chatSchema)

export default Chat
