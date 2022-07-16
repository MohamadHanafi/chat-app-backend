import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import { generateToken } from '../utils/generateToken.js'

// @desc    sign users in
// @route   POST /api/v1/users/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // check if the email and password are attached
  if (!email || !password) {
    res.status(400)
    throw new Error('Please provide the email and password')
  }

  // find the user
  const user = await User.findOne({ email })
  // return error if user not found
  if (!user) {
    res.status(400)
    throw new Error('Invalid email')
  }

  // check if the password is correct
  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    res.status(400)
    throw new Error('Invalid password')
  }

  // generate token
  const token = generateToken(user._id)

  // response
  res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status,
    token,
  })
})

// @desc    get user profile
// @route   get /api/v1/users/:id
// @access  Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }
  res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status,
    about: user.about,
    avatar: user.avatar,
  })
})

export { login, getUserProfile }
