import { Router } from "express"

import { registerHotel} from "../controllers/hotel.controller.js"

const router = Router()

router.route("/register-hotel").post(registerHotel)

export default router