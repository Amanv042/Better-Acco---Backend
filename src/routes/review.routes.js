import { Router } from "express"

import { } from "../controllers/hotel.controller.js"

const router = Router()

router.route("/add-review").post(addReview)

export default router