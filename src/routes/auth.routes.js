const {Router} = require('express')

const authRouter = Router()
const authController = require('../controllers/auth.controller')

// register endpoint

authRouter.post("/register",authController.registerUserController)

// login endpoint
authRouter.post("/login",authController.loginUserController)



module.exports = authRouter