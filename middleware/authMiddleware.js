import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protectRoute = asyncHandler(async (req, res, next) => {
  let token = ''

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decodedToken.id).select('-password')

    if (!user) {
      res.status(401)
      throw new Error('Invalid token')
    } else {
      req.user = user
      next()
    }
  } else {
    res.status(401)
    throw new Error('Not authorized')
  }
})

export { protectRoute }
