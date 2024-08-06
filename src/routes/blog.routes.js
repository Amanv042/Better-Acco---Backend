import { Router } from "express"

import { } from "../controllers/blog.controller.js"

const router = Router()

router.route("/add-blog").post(addBlog)

export default router