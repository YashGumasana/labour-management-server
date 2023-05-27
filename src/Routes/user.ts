import express from 'express'
const router = express.Router()
import { authController } from '../controllers'
import * as validation from '../validation'

router.post('/register', validation.register, authController.register)
router.post('/login', validation.login, authController.login)
router.post('/refresh_token', authController.refresh_token)
// router.get('/paypal_identiy_check', authController.paypal_identiy_check)
// router.get('/get_paypal_token', authController.get_paypal_token)



export const userRouter = router