import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      required: true,
      enum: ['online', 'busy', 'offline', 'away'],
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.pre('validate', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

export default mongoose.model('User', userSchema)
