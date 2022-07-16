import { Router } from 'express'
import { getUserProfile, login } from '../controllers/userControllers.js'

const router = Router()

router.route('/login').post(login)
router.route('/:id').get(getUserProfile)

export default router
