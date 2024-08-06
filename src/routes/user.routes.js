import { Router } from "express"

import { } from "../controllers/user.controller.js"

const router = Router()

router.route("/register").post(registerUser)

export default router