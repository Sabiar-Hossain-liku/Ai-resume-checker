const {Router} = require('express')

const authRouter = Router()
const authController = require('../controllers/auth.controller')
const authMiddleware = require("../middlewares/auth.middleware")
// register endpoint

authRouter.post("/register",authController.registerUserController)

// login endpoint
authRouter.post("/login",authController.loginUserController)


// blacklist route
authRouter.get("/logout",authController.logoutUserController)


authRouter.get("/get-me",authMiddleware,authController.getMeController)


module.exports = authRouter